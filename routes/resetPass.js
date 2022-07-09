const express = require('express')
const router = express.Router()

// middleware that is specific to this router
router.use((req, res, next) => {
  console.log('at resetpass')
  next()
})

var userModel = require('../database/models/userModel.js')

router
  .route('/')

  .get((req, res) => {
    if (req.session.resetPass) {
      res.render('resetPass', { username: req.session.resetPass, error: '' })
    } else {
      res.status(401)
      res.end('Unauthorized Access!')
    }
  })

  .post((req, res) => {
    if (req.session.resetPass) {
      if (req.body.password === req.body.rePassword) {
        userModel.updateOne(
          { username: req.session.resetPass },
          { password: req.body.password },
          (err, data) => {
            if (err) {
              res.render('resetPass', {
                username: req.session.resetPass,
                error: 'Something went wrong! try again...',
              })
            } else {
              res.redirect('/login')
            }
          }
        )
      } else {
        res.render('resetPass', {
          username: req.session.resetPass,
          error: 'Passwords Mismatch!',
        })
      }
    } else {
      res.status(401)
      res.end('Unauthorized Access!')
    }
  })

module.exports = router
