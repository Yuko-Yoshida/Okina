const mongoose = require('mongoose')
const Schema = mongoose.Schema


const AlbumSchema = new Schema({
  artist: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  songs: { type: [String], required: true },
  artwork: { type: String },
  date: { type: Date, default: Date.now }
})

module.exports = AlbumSchema
