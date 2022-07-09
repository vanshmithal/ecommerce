var productModel = require('../database/models/productModel.js')

module.exports = (pId, adminId, callback) => {
  if (pId) {
    productModel
      .find({ _id: pId })
      .then((data) => {
        callback(data)
      })
      .catch((err) => {
        callback(null)
      })
  } else if (adminId) {
    productModel
      .find({ adminId: adminId })
      .then((data) => {
        callback(data)
      })
      .catch((err) => {
        callback(null)
      })
  } else {
    productModel
      .find({})
      .then((data) => {
        callback(data)
      })
      .catch((err) => {
        callback(null)
      })
  }
}
