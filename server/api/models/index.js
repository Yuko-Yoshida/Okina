const mongoose = require('mongoose')
const environment = process.env.NODE_ENV || 'development'
const env = require(`../../../env.${environment}.js`)


mongoose.connect(env.mongo_url)

const UserSchema = require('./user')

module.exports = {
  User: mongoose.model('User', UserSchema)
}
