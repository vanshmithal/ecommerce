var mongoose = require('mongoose')

module.exports =  (
  mongoose.connect('mongodb+srv://admin:admin@cluster0.wljg0.mongodb.net/ecommerceDB?retryWrites=true&w=majority')
    .then( () => console.log('DB Connected!') )
    .catch( () => console.log('Error Connecting to DB!') )
)