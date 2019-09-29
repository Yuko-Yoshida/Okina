const express = require('express')
const router = express.Router()
const routerAuth = express.Router()
const Model = require('../models')
const multer = require('multer')
const fs = require('fs')


router.get('/', (req, res) => {
  Model('Album').find({}, (err, albums) => {
    if (err) return res.status(400).send()

    const albumInfos = albums.map((album) => {
      return {
        artist: album.artist,
        title: album.title,
        songs: album.songs,
        artwork: album.artwork,
        date: album.date
      }
    })
    res.status(200).json(albumInfos)
  })
})

module.exports = { album: router, albumAuth: routerAuth }
