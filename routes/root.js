const express = require('express')
const router = express.Router()

// middleware that is specific to this router
router.use((req, res, next) => {
  console.log('at root')
  next()
})

router.get('/', (req, res) => {
  if (req.session.isLoggedIn) {
    res.render('home', { props: { user: req.session.user } })
  } else {
    res.render('home', { props: { user: { username: 'Guest' } } })
  }
})

module.exports = router
