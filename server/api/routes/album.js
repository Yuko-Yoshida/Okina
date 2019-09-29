const express = require('express')
const router = express.Router()
const routerAuth = express.Router()
const Model = require('../models')
const multer = require('multer')
const fs = require('fs')


const storage = multer.diskStorage({
  destination: function(req, res, cb) {
    const dist = __dirname+'/uploads'
    if (!fs.existsSync(dist)) fs.mkdirSync(dist)
    cb(null, dist)
  }
})

const upload = multer({ storage: storage }).fields([
  { name: 'albumInfo', maxCount: 1 },
  { name: 'artwork', maxCount: 1 },
])

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

routerAuth.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err) return res.status(400).send()
    if (!req.body.albumInfo) return res.status(400).send()

    const body = JSON.parse(req.body.albumInfo)
    const artwork = (req.files.artwork) ? req.files.artwork[0].filename : ''
    const albumInfo = {
      artist: body.artist,
      title: body.title,
      description: body.description,
      songs: body.songs,
      artwork: artwork,
    }
    if (!albumInfo.artist || !albumInfo.title || !albumInfo.songs) {
      return res.status(400).send()
    }

    return Model('Album').create(albumInfo, (err, album) => {
      if (err) return res.status(400).send()
      return res.status(200).json({ id: album._id })
    })
  })
})

module.exports = { album: router, albumAuth: routerAuth }
