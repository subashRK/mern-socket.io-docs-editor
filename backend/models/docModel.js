const mongoose = require("mongoose")

const docSchema = new mongoose.Schema({
  name: {
    type: String
  },
  owner: {
    type: String,
    required: [true, "Owner field is required!"],
  },
  content: {
    type: Object,
    default: { ops: [] }
  },
  allowedUsers: {
    type: [String],
    required: [true, "Allowed Users field is required!"]
  }
})

module.exports = mongoose.model("Doc", docSchema)
