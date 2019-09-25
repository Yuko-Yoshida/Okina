const mongoose = require('mongoose')
const environment = process.env.NODE_ENV || 'development'
const env = require(`../../../env.${environment}.js`)


mongoose.connect('mongodb://localhost/sake')

const UserSchema = require('./user')

module.exports = {
  User: mongoose.model('User', UserSchema)
}
