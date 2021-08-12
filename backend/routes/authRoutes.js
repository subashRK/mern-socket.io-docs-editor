const { sendServerError, login, getUser, validateEmail } = require("../utils")
const User = require("../models/userModel")
const router = require("express").Router()
const bcrypt = require("bcrypt")
const { verifyRoute } = require("../middlewares")

router.get("/user", (req, res) => {
  res.json(getUser(req.cookies.token))
})

router.post("/login", verifyRoute, async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ error: "No user with that email exists!" })

    const matched = await bcrypt.compare(password, user.password)

    if (matched) {
      const userToLogin = { id: user._id, email: user.email }
      login(res, userToLogin)
      return res.status(200).json({ user: userToLogin })
    }

    res.status(400).json({ error: "Incorrect password!" })
  } catch(e) {
    sendServerError(res)
  }
})

router.post("/signup", verifyRoute, async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })
    if (user) return res.status(400).json({ error: "An user with that email already exists!" })
    if (!email || !validateEmail(email)) return res.status(400).json({ error: "Invalid email!" })

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await User.create({ email, password: hashedPassword })

    const userToLogin = { _id: newUser._id, email: newUser.email }
    login(res, userToLogin)

    res.status(200).json({ user: userToLogin })
  } catch(e) {
    const passwordError = e.errors?.password?.message
    const emailError = e.errors?.email?.message

    if (passwordError || emailError) return res.status(400).json({ 
      error: emailError ? emailError + passwordError && ` ${passwordError}` : passwordError
    })

    sendServerError(res)
  }
})

router.get("/logout", (req, res) => {
  res.cookie("token", "", { maxAge: 1 })
  res.json({ message: "Succesfully logged out!" })
})

module.exports = router
