const express = require('express')
const router = express.Router()

// middleware that is specific to this router
router.use((req, res, next) => {
  console.log('at login')
  next()
})

const getUserDB = require('../utils/userDB')

router
  .route('/')

  .get((req, res) => {
    var props = { init: true, error: '', success: '', username: '' }
    if (req.session.fromSignup) {
      props.username = req.session.fromSignup
      props.success = 'Signup Successful, confirm via link sent to email...'
    }
    if (req.session.fromSignout) {
      props.username = req.session.fromSignout
      props.success = 'Successfully logged out...'
    }
    if (req.session.fromVerify) {
      props.username = req.session.fromVerify
      props.success = 'User Verified! Login...'
    }
    if (req.session.resetPass) {
      props.username = req.session.resetPass
      props.success = 'Password Updated! Login...'
    }
    if (req.session.fromNotLoggedIn) {
      props.error = req.session.fromNotLoggedIn
    }
    if (req.session.fromFailAdmin) {
      props.username = req.session.user.username
      props.error = 'Naughty Naughty!'
    }

    req.session.destroy()
    res.render('login', { props: props })
  })

  .post((req, res) => {
    if (req.body.username && req.body.password) {
      getUserDB(req.body.username, (data) => {
        if (data) {
          if (!data.verified) {
            res.render('login', {
              props: {
                init: false,
                error: 'User not Verified!',
                success: '',
                username: req.body.username,
              },
            })
          } else if (data.password !== req.body.password) {
            res.render('login', {
              props: {
                init: false,
                error: 'Wrong Password',
                success: '',
                username: req.body.username,
              },
            })
          } else {
            req.session.isLoggedIn = true
            req.session.user = data
            if (data.role === 1) {
              res.redirect('/admin')
            } else {
              res.redirect('/')
            }
          }
        } else {
          res.render('login', {
            props: {
              init: false,
              error: 'User not Found!',
              success: '',
              username: req.body.username,
            },
          })
        }
      })
    } else {
      res.status(500)
      res.end('no no no no')
    }
  })

module.exports = router
