const mongoose = require('mongoose')
const Schema = mongoose.Schema


const ArtistSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  avatar: { type: String }
})

module.exports = ArtistSchema
