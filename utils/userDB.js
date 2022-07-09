var userModel = require('../database/models/userModel.js')

module.exports = (username, callback) => {
  userModel
    .findOne({ username: username })
    .then((data) => {
      if (data) {
        callback(data._doc)
      } else {
        callback(null)
      }
    })
    .catch((err) => {
      console.log(err.message)
      callback(null)
    })
}
