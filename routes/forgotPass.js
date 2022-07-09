const express = require('express')
const router = express.Router()

// middleware that is specific to this router
router.use((req, res, next) => {
  console.log('at forgotPass')
  next()
})

const url = require('../utils/url')
const mailFunc = require('../utils/mailService.js')
const userModel = require('../database/models/userModel')

router
  .route('/')

  .get((req, res) => {
    res.render('forgotPass', { success: '', error: '' })
  })

  .post((req, res) => {
    var email = req.body.username
    userModel.findOne({ username: email }).then((data) => {
      if (data) {
        mailFunc(
          email,
          'Password Reset - Ecommerce',
          `<a href="${url}/resetPassword/${data._id}">Click Me to Reset Password</a>`,
          (err, data) => {
            if (err) {
              res.render('forgotPass', {
                success: '',
                error: 'Some Error Occurred, try again...',
              })
            } else {
              res.render('forgotPass', { success: 'Email sent!', error: '' })
            }
          }
        )
      } else {
        res.render('forgotPass', { success: '', error: 'not in our records!' })
      }
    })
  })

module.exports = router
