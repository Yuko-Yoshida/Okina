const mongoose = require('mongoose')

const User = require('./seeders/user.seeder')
const Artist = require('./seeders/artist.seeder')

const mongoURL = process.env.MONGO_URL || 'mongodb://localhost:27017/okina'

/**
 * Seeders List
 * order is important
 * @type {Object}
 */
const seedersList = {
  User,
  Artist,
}
/**
 * Connect to mongodb implementation
 * @return {Promise}
 */
const connect = async () =>
  await mongoose.connect(mongoURL, { useNewUrlParser: true })
/**
 * Drop/Clear the database implementation
 * @return {Promise}
 */
const dropdb = async () => mongoose.connection.db.dropDatabase()

module.exports = {
  seedersList,
  connect,
  dropdb
}
