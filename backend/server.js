const DEV_ENV = process.env.NODE_ENV === "development"
const DOMAIN = DEV_ENV ? "http://localhost:3000" : process.env.DOMAIN
const PORT = process.env.PORT || 5000

const express = require("express")
const http = require("http")
const socketIo = require("socket.io")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const authRoutes = require("./routes/authRoutes")
const docRoutes = require("./routes/docRoutes")
const mongoose = require("mongoose")
const Doc = require("./models/docModel")
const { getUser } = require("./utils")
const { parse } = require("cookie")
if (DEV_ENV) require("dotenv").config()

// Initialization
const app = express()
const server = http.createServer(app)
const io = socketIo(server, {
  cors: { origin: [DOMAIN], credentials: true }
})

// Middlewares
app.use(cors({ origin: DOMAIN, credentials: true }))
app.use(cookieParser())
app.use(express.json())
app.use(authRoutes)
app.use(docRoutes)

// Socket.io
io.use(async (socket, next) => {
  const user = getUser(parse(socket.request.headers.cookie).token)
  const id = socket.handshake.query.id

  if (!id) return next(new Error("Specify a document id!"))
  if (!user) return next(new Error("Authentication failed!"))

  let doc = await Doc.findOne({ _id: id })

  if (!doc) return next(new Error("No document with that id exists!"))
  if (!doc.allowedUsers.includes(user.email)) return next(new Error("You can't access this document!"))

  socket.user = user
  socket.doc = doc

  next()
})

const activeDocs = {}

io.on("connection", socket => {
  const id = socket.handshake.query.id
  let doc = activeDocs[id]
  const user = socket.user

  if (doc) {
    doc.users.push({ email: user.email, socketId: socket.id })
  } else {
    activeDocs[id] = { users: [{ email: user.email, socketId: socket.id }], latestContent: socket.doc.content }
    doc = activeDocs[id]
  }

  socket.join(id)
  socket.emit("doc-content", doc.latestContent)

  if (doc.users.length === 1) socket.emit("send-latest-content")

  socket.on("latest-content", content => {
    doc.latestContent = content
  })

  socket.on("update-content", content => {
    socket.to(id).emit("update-content", content)
  })

  socket.on("disconnect", async () => {
    if (doc.users.length === 1) {
      await Doc.findOneAndUpdate({ _id: id }, { content: doc.latestContent }).catch(e => console.log(e.message))
      return delete doc
    }
    
    doc.users = doc.users.filter(currentUser => currentUser.socketId !== socket.id)
    socket.to(doc.users[0].socketId).emit("send-latest-content")
  })
})

// Mongoose connection
mongoose.connect(`mongodb+srv://subash:${process.env.MONGO_DB_USER_PASSWORD}@cluster0.e8nhq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})

// Running server
server.listen(PORT)
