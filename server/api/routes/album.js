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
        id: album._id,
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

routerAuth.put('/:id', (req, res) => {
  Model('Album').findOne({ _id: req.params.id }, (err, album) => {
    if (err) return res.status(400).send()
    if (!album) return res.status(400).send()

    return upload(req, res, (err) => {
      if (err) return res.status(400).send()

      const body = (req.body.albumInfo) ? JSON.parse(req.body.albumInfo) : req.body

      const artist = (body.artist) ? body.artist : album.artist
      const title = (body.title) ? body.title : album.title
      const description = (body.description) ? body.description : album.description
      const songs = (body.songs) ? body.songs : album.songs
      const artwork = (req.files.artwork) ? req.files.artwork[0].filename : album.artwork

      const albumInfo = {
        artist: artist,
        title: title,
        description: description,
        songs: songs,
        artwork: artwork,
      }

      return album.update(albumInfo, (err) => {
        if (err) return res.status(400).send()
        if (req.files.artwork) {
          fs.unlinkSync(__dirname+'/uploads/'+album.artwork)
          console.log('deleted: '+album.artwork);
        }
        return res.status(200).send()
      })
    })
  })
})

module.exports = { album: router, albumAuth: routerAuth }
