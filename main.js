const express = require('express')
const app = express()
const hostname = '0.0.0.0'
const port = 3000

//db initialized!
require('./database')

//ejs templating
app.set('view engine', 'ejs')

//get models
var userModel = require('./database/models/userModel.js')
// var productModel = require('./database/models/productModel.js')

//db access functions
const getUserCartDB = require('./utils/userCartDB')
const getUserDB = require('./utils/userDB')
const getProducts = require('./utils/productsDB')

//express-session module
var session = require('express-session')
app.use(
  session({
    secret: '123456789',
    resave: false,
    saveUninitialized: true,
  })
)

//middlewares
app.use(express.static('public'))
app.use(express.static('uploads'))
app.use(express.urlencoded())
app.use(express.json())

const adminRoute = require('./routes/admin')
app.use('/admin', adminRoute)

const loginRoute = require('./routes/login')
app.use('/login', loginRoute)

const signupRoute = require('./routes/signup')
app.use('/signup', signupRoute)

app.get('/signout', (req, res) => {
  req.session.fromSignout = req.session.user
    ? req.session.user.username
    : 'server refresh...'
  res.redirect('/login')
})

app.get('/getNextProducts/:id', (req, res) => {
  const { id } = req.params

  getProducts(null, null, (data) => {
    if (data) {
      if (id === 'full') {
        res.end(JSON.stringify(data))
      } else {
        var end = ~~id + 5 < data.length ? ~~id + 5 : data.length + 1
        var tempData = data.slice(id, end)
        res.end(JSON.stringify(tempData))
      }
    } else {
      res.status(500)
      res.end('some internal error!')
    }
  })
})

app.get('/verifyUser/:id', (req, res) => {
  const { id } = req.params

  userModel
    .findOne({ _id: id })
    .then((data) => {
      if (data) {
        if (data.verified) {
          req.session.fromVerify = data.username
          res.redirect('/login')
        } else {
          userModel.updateOne({ _id: id }, { verified: true }, (err, d) => {
            if (err) {
              res.status(500)
              res.end('internal server error')
            } else {
              req.session.fromVerify = data.username
              res.redirect('/login')
            }
          })
        }
      } else {
        res.status(500)
        res.end('not in our records!')
      }
    })
    .catch(() => {
      res.status(500)
      res.end('some internal error occured')
    })
})

const forgotPassRoute = require('./routes/forgotPass')
app.use('/forgotPassword', forgotPassRoute)

app.get('/resetPassword/:id', (req, res) => {
  var { id } = req.params

  userModel
    .findOne({ _id: id })
    .then((data) => {
      if (data) {
        req.session.resetPass = data.username
        res.redirect('/resetPassword')
      } else {
        res.status(401)
        res.end('not in our records!')
      }
    })
    .catch((data) => {
      res.status(500)
      res.end('some internal error occured!')
    })
})

const resetPassRoute = require('./routes/resetPass')
app.use('/resetPassword', resetPassRoute)

const shoppingCartRoute = require('./routes/shoppingCart')
app.use('/shoppingCart', shoppingCartRoute)

app.get('/getUserCart', (req, res) => {
  if (req.session.isLoggedIn) {
    res.status(200)
    getUserCartDB(req.session.user._id, (data) => {
      if (data) {
        res.end(JSON.stringify({ data: JSON.stringify(data) }))
      } else {
        res.end('error fetching user cart')
      }
    })
  } else {
    res.status(401)
    res.end('unauthorised access')
  }
})

const rootRoute = require('./routes/root')
app.use('/', rootRoute)

app.listen(port, hostname, () => {
  console.log(`Example app listening at http://${hostname}:${port}`)
})
