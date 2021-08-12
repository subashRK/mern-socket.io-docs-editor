const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email required!"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password required!"]
  }
})

module.exports = mongoose.model("User", userSchema)
