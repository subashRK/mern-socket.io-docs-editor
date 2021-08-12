const DEV_ENV = process.env.NODE_ENV === "development"

const jwt = require("jsonwebtoken")
if (DEV_ENV) require("dotenv").config()

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

const getUser = token => {
  let user = null

  jwt.verify(token, JWT_SECRET_KEY, (err, decodedUser) => {
    if (err) return
    user = decodedUser
  })

  return user
}

const login = (res, user) => {
  const token = jwt.sign(user, JWT_SECRET_KEY)
  const maxAge = 1000 * 60 * 60 * 24 * 31 // one month
  res.cookie("token", token, { httpOnly: true, secure: !DEV_ENV, maxAge })
}

const validateEmail = email => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email.toLowerCase())
}

const sendServerError = res => res.status(500).json({ error: "Something went wrong!" })

module.exports = { getUser, login, sendServerError, validateEmail }
