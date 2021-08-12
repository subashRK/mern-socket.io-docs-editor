const router = require("express").Router()
const Doc = require("../models/docModel")
const { sendServerError, validateEmail } = require("../utils")
const { verifyRoute } = require("../middlewares")

router.use((req, res, next) => verifyRoute(true, req, res, next), )

router.get("/docs", async (req, res) => {
  try {
    const docs = await Doc.find({ allowedUsers: req.user.email })
    const modifiedDocs = docs.map(({ _id, owner, name, allowedUsers }) => ({ id: _id, owner, allowedUsers, name }))
    res.json(modifiedDocs)
  } catch {
    sendServerError(res)
  }
})

router.post("/doc/new", async (req, res) => {
  try {
    const { _id, name, allowedUsers } = await Doc.create({ owner: req.user.email, allowedUsers: [req.user.email] })
    return res.status(201).json({ message: "Succesfully created a doc!", doc: { id: _id, name, allowedUsers } })
  } catch(e) {
    sendServerError(res)
  }
})

router.put("/doc/rename", async (req, res) => {
  try {
    const { id, name } = req.body
    await Doc.findOneAndUpdate({ _id: id }, { name: name })
    return res.status(200).json({ message: "Succesfully renamed the doc!", doc: { id, name } })
  } catch(e) {
    sendServerError(res)
  }
})

router.put("/doc/add-user", async (req, res) => {
  try {
    const { id, email } = req.body

    if (!email || !validateEmail(email)) return res.status(400).json({ error: "Invalid email!" })

    const doc = await Doc.findOne({ _id: id })

    if (!doc) return res.status(404).json({ error: "No doc with that id exists!" })
    if (doc.allowedUsers.includes(email)) return res.status(400).json({ error: "An user with that email is already in the allowed user's list" })

    doc.allowedUsers.push(email)
    await doc.save()

    return res.status(200).json({ message: "Succesfully added the user!", doc: { id, allowedUsers: doc.allowedUsers } })
  } catch(e) {
    sendServerError(res)
  }
})

module.exports = router
