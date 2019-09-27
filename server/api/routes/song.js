const express = require('express')
const router = express.Router()
const routerAuth = express.Router()
const Model = require('../models')


router.get('/', (req, res) => {
  Model('Song').find({}, (err, songs) => {
    if (err) res.status(400).send()

    const songInfos = songs.map((song) => {
      return {
        artist: song.artist,
        title: song.title,
        album: song.album,
        artwork: song.artwork,
        filename: song.filename,
        date: song.date
      }
    })
    res.status(200).json(songInfos)
  })
})

module.exports = { song: router, songAuth: routerAuth }
