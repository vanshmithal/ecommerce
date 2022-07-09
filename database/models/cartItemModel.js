const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  pId: {
    type: String,
    required: true,
  },
  quantity: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  }
},
{ timestamps: true }
);

module.exports = mongoose.model('cartItem', cartItemSchema);