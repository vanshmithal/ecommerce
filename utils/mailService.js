const publicKey = '337cf7cadf6fc76499a56958440f412c'
const secretKey = '1a09c23d0014e42e695c445e513b09d0'
const mailjet = require('node-mailjet').apiConnect(publicKey, secretKey)

module.exports = (recieverEmail, subject, htmlContent, callback) => {
  const request = mailjet.post('send').request({
    FromEmail: 'apitest496@gmail.com',
    FromName: 'Ecommerce App',
    Subject: subject,
    'Html-part': htmlContent,
    Recipients: [{ Email: recieverEmail }],
  })
  request
    .then((result) => {
      callback(null, result)
    })
    .catch((err) => {
      callback(err, null)
    })
}
