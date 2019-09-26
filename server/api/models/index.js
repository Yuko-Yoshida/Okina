const mongoose = require('mongoose')
const environment = process.env.NODE_ENV || 'development'
const env = require(`../../../env.${environment}.js`)


mongoose.connect(env.mongo_url)

const User = mongoose.model('User', require('./user'))
const Artist = mongoose.model('Artist', require('./artist'))

const schemas = {
  User,
  Artist,
}

const Model = (schemaName) => {
  if (!schemas[schemaName]) throw Error()
  return schemas[schemaName]
}

module.exports = Model
