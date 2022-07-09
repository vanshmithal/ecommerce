const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    minlength: 8,
    required: true
  },
  profilePic:{
    type: String,
    required: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  role: {
    type: Number,
    default: 1
  }
},
{ timestamps: true }
);

module.exports = mongoose.model('user', userSchema);