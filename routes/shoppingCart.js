const express = require('express')
const router = express.Router()

// middleware that is specific to this router
router.use((req, res, next) => {
  console.log('at cart')
  next()
})

const getUserCartDB = require('../utils/userCartDB')
const getProducts = require('../utils/productsDB')
const cartItemModel = require('../database/models/cartItemModel')

router.get('/', (req, res) => {
  if (req.session.isLoggedIn) {
    getUserCartDB(req.session.user._id, (data) => {
      if (data) {
        res.render('cart', {
          userDetails: { ...req.session.user, cartItems: data },
        })
      } else {
        res.end('error fetching user cart')
      }
    })
  } else {
    req.session.fromNotLoggedIn = 'Please login to use cart features...'
    res.redirect('/login')
  }
})

router
  .route('/:productId')

  .get((req, res) => {
    var { productId } = req.params
    getProducts(productId, null, (productInfo) => {
      res.status(200)
      res.render('cartViewDetails', { data: productInfo[0] })
      return
    })
  })

  .post((req, res) => {
    var { productId } = req.params
    getProducts(productId, null, (data) => {
      if (data[0]) {
        if (req.session.isLoggedIn) {
          var { _id, quantity } = data[0]
          if (quantity === 0) {
            res.status(404)
            res.end('out of stock!')
            return
          }
          cartItemModel
            .create({
              pId: _id,
              quantity: 1,
              userId: req.session.user._id,
            })
            .then(() => {
              res.status(200)
              res.end('product added to cart!')
            })
            .catch((err) => {
              console.log(err.message)
              res.status(500)
              res.end('some internal error, try again')
            })
        } else {
          res.status(401)
          res.end('goto login')
        }
      } else {
        res.status(500)
        res.end('internal server error!')
      }
    })
  })

  .patch((req, res) => {
    const { productId } = req.params

    cartItemModel
      .findOne({ _id: productId })
      .then((data) => {
        getProducts(data.pId, null, (productInfo) => {
          if (productInfo[0]) {
            var qty =
              req.body.action === 'plus'
                ? ~~data.quantity + 1
                : ~~data.quantity - 1
            console.log(qty, productInfo[0].quantity)
            if (qty > productInfo[0].quantity || qty < 1) {
              res.status(404)
              res.end('not enough available/zero not allowed!')
            } else {
              cartItemModel
                .updateOne({ _id: productId }, { quantity: qty })
                .then(() => {
                  res.status(200)
                  res.end('quantity updated!')
                })
                .catch(() => {
                  res.status(500)
                  res.end('internal error')
                })
            }
          } else {
            res.status(500)
            res.end('internal error')
          }
        })
      })
      .catch(() => {
        res.status(500)
        res.end('internal error')
      })
  })

  .delete((req, res) => {
    var { productId } = req.params
    cartItemModel
      .deleteOne({ _id: productId })
      .then(() => {
        res.status(200)
        res.end('item deleted!')
      })
      .catch(() => {
        res.status(500)
        res.end('internal error')
      })
  })

module.exports = router
