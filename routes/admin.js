const express = require('express')
const router = express.Router()

var productModel = require('../database/models/productModel.js')
var cartItemModel = require('../database/models/cartItemModel.js')
var getProducts = require('../utils/productsDB')
const upload = require('../utils/multer.js')

// middleware that is specific to this router
router.use((req, res, next) => {
  if (req.session.isLoggedIn) {
    if (req.session.user.role === 1) {
      console.log('at admin')
      next()
    } else {
      req.session.fromFailAdmin = true
      res.redirect('/login')
    }
  } else {
    res.redirect('/')
  }
})

router
  .route('/')

  .get((req, res) => {
    getProducts(null, req.session.user._id, (data) => {
      if (data) {
        res.render('admin', { userDetails: req.session.user, products: data })
      } else {
        res.status(500)
        res.end('some internal error!')
      }
    })
  })

router
  .route('/product')

  .post(upload.single('productImg'), (req, res) => {
    var obj = {
      ...req.body,
      image: req.file.filename,
      adminId: req.session.user._id,
    }
    productModel
      .create(obj)
      .then((data) => {
        res.redirect('/admin')
      })
      .catch((err) => {
        res.status(500)
        res.end('some internal error!')
      })
  })

router
  .route('/product/:id')

  .post(upload.single('productImg'), (req, res) => {
    var { id } = req.params
    if (req.body.delete) {
      productModel
        .deleteOne({ _id: id })
        .then((data) => {
          cartItemModel.deleteMany({ pId: id }).then(() => {
            res.redirect('/admin')
          })
          res.redirect('/admin')
        })
        .catch((err) => {
          res.status(500)
          res.end('some error occured!')
        })
    } else {
      var obj = { ...req.body }
      if (req.file) {
        obj = { ...req.body, image: req.file.filename }
      }
      productModel
        .updateOne({ _id: id }, obj)
        .then((data) => {
          console.log(data)
          res.redirect('/admin')
        })
        .catch((err) => {
          res.status(500)
          res.end('some error occured!')
        })
    }
  })

module.exports = router
