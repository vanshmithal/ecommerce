const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price:{
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  quantity: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  adminId: {
    type: String,
    required: true
  }
},
{ timestamps: true }
);

module.exports = mongoose.model('product', productSchema);