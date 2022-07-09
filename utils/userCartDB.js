var cartItemModel = require('../database/models/cartItemModel.js')
var getProducts = require('./productsDB')

module.exports = (id, callback) => {
  cartItemModel
    .find({ userId: id })
    .then((data) => {
      var ids = data.map((d) => d.pId)
      // console.log(ids)
      getProducts(ids, null, (pData) => {
        if (pData) {
          // console.log(pData)
          var cartDataFinal = []
          var i = pData.length - 1
          data.forEach((x) => {
            var { name, price, image } = pData[i]
            var cartItem = {
              _id: x._id,
              pId: x.pId,
              quantity: x.quantity,
              userId: x.userId,
              name,
              price,
              image,
            }
            cartDataFinal.push(cartItem)
            i--
          })
          callback(cartDataFinal)
        } else {
          callback(null)
        }
      })
    })
    .catch((err) => {
      callback(null)
    })
}
