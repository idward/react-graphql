const mongoose = require('mongoose');

//mongodb connection
module.exports = function (mongoUri) {
  mongoose.connect(mongoUri, {useNewUrlParser: true, useCreateIndex: true})
    .then(() => {
      console.log('database connected...')
    })
    .catch((err) => {
      console.log(`database connection failed: ${err}`)
    });
}