const { getUser } = require("./utils")
const { parse } = require("cookie")

const verifyRoute = (authRequired, req, res, next) => {
  const token = req.cookies.token
  const user = getUser(token)

  if (authRequired) {
    if (!token || !user) return res.status(401).json({ error: "Unauthorized" })
  } else {
    if (user) return res.status(400).json({ error: "You are already logged in!" })
  }

  req.user = user
  next()
}

module.exports = { verifyRoute }
