const mongoose = require('mongoose')
const Schema = mongoose.Schema


const SongSchema = new Schema({
  artist: { type: String, requried: true },
  title: { type: String, requried: true },
  album: { type: String },
  artwork: { type: String },
  filename: { type: String, requried: true },
  date: { type: Date, default: Date.now }
})

module.exports = SongSchema
