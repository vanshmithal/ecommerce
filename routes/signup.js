const express = require('express')
const router = express.Router()

const upload = require('../utils/multer.js')
const mailFunc = require('../utils/mailService.js')
const userModel = require('../database/models/userModel.js')
const url = require('../utils/url')

// middleware that is specific to this router
router.use((req, res, next) => {
  console.log('at signup')
  next()
})

const getUserDB = require('../utils/userDB')

router
  .route('/')
  .get((req, res) => {
    res.render('signup', { props: { init: true, error: '' } })
  })

  .post(upload.single('profilePic'), (req, res) => {
    if (req.body.username && req.body.password && req.file) {
      getUserDB(req.body.username, (data) => {
        if (data == null) {
          userModel
            .create({
              username: req.body.username,
              password: req.body.password,
              profilePic: req.file.filename,
            })

            .then((user) => {
              req.session.fromSignup = user.username
              mailFunc(
                user.username,
                'Account Confirmation - Ecommerce',
                `<a href="${url}/verifyUser/${user._id}">Click Me to Verify Email</a>`,
                (err, data) => {
                  if (err) {
                    console.log(err)
                  } else {
                    res.redirect('/login')
                  }
                }
              )
            })

            .catch(() => {
              //res.status(500)
              res.render('signup', {
                props: { init: false, error: 'Internal DB Error, try again!' },
              })
            })
        } else {
          res.render('signup', {
            props: { init: false, error: 'User Already Registered!' },
          })
        }
      })
    } else {
      res.status(500)
      res.end('no no no no')
    }
  })

module.exports = router
