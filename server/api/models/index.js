const mongoose = require('mongoose')
const environment = process.env.NODE_ENV || 'development'
const env = require(`../../../env.${environment}.js`)


mongoose.connect(env.mongo_url)

const User = mongoose.model('User', require('./user'))
const Artist = mongoose.model('Artist', require('./artist'))
const Song = mongoose.model('Song', require('./song'))
const Album = mongoose.model('Album', require('./album'))


const schemas = {
  User,
  Artist,
  Song,
  Album
}

const Model = (schemaName) => {
  if (!schemas[schemaName]) throw Error(`${schemaName} not found.`)
  return schemas[schemaName]
}

module.exports = Model
