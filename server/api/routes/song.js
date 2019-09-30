const express = require('express')
const router = express.Router()
const routerAuth = express.Router()
const Model = require('../models')
const multer = require('multer')
const fs = require('fs')
const ffmpeg = require('fluent-ffmpeg')


const storage = multer.diskStorage({
  destination: function(req, res, cb) {
    const dist = __dirname+'/uploads'
    if (!fs.existsSync(dist)) fs.mkdirSync(dist)
    cb(null, dist)
  }
})

const upload = multer({ storage: storage }).fields([
  { name: 'song', maxCount: 1 },
  { name: 'songInfo', maxCount: 1 },
  { name: 'artwork', maxCount: 1 },
])


router.get('/', (req, res) => {
  Model('Song').find({}, (err, songs) => {
    if (err) res.status(400).send()

    const songInfos = songs.map((song) => {
      return {
        id: song._id,
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

router.get('/:id', (req, res) => {
  Model('Song').findOne({ _id: req.params.id }, (err, song) => {
    if (err) return res.status(400).send()
    if (!song) return res.status(400).send()

    const songInfo = {
      id: song._id,
      artist: song.artist,
      title: song.title,
      album: song.album,
      artwork: song.artwork,
      filename: song.filename,
      date: song.date
    }

    return res.status(200).json(songInfo)
  })
})

router.get('/:id/audio', (req, res) => {
  Model('Song').findOne({ _id: req.params.id }, (err, song) => {
    if (err) return res.status(400).send()
    if (!song) return res.status(400).send()

    return res.status(200).sendFile(__dirname+'/uploads/'+song.filename)
  })
})

router.get('/:id/artwork', (req, res) => {
  Model('Song').findOne({ _id: req.params.id }, (err, song) => {
    if (err) return res.status(400).send()
    if (!song) return res.status(400).send()
    if (!song.artwork) return res.status(404).send()

    return res.status(200).sendFile(__dirname+'/uploads/'+song.artwork)
  })
})

routerAuth.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err) return res.status(400).send()
    if (!req.body.songInfo) return res.status(400).send()
    if (!req.files.song) return res.status(400).send()

    const body = JSON.parse(req.body.songInfo)
    const artwork = (req.files.artwork) ? req.files.artwork[0].filename : ''
    const songInfo = {
      artist: body.artist,
      title: body.title,
      album: body.album,
      artwork: artwork,
      filename: req.files.song[0].filename
    }
    if (!songInfo.artist || !songInfo.title) return res.status(400).send()

    return Model('Song').create(songInfo, (err, song) => {
      if (err) return res.status(400).send()

      return ffmpeg(__dirname+'/uploads/'+song.filename)
              .output(__dirname+'/uploads/'+song.filename+'.wav')
              .on('error', (err) => res.status(400).send())
              .on('end', () => {
                fs.renameSync(__dirname+'/uploads/'+song.filename+'.wav',
                              __dirname+'/uploads/'+song.filename)
                return res.status(200).json({ id: song._id })
              })
              .run()
    })
  })
})

routerAuth.put('/:id', (req, res) => {
  Model('Song').findOne({ _id: req.params.id }, (err, song) => {
    if (err) return res.status(400).send()
    if (!song) return res.status(400).send()

    return upload(req, res, (err) => {
      if (err) return res.status(400).send()

      const body = (req.body.songInfo) ? JSON.parse(req.body.songInfo) : req.body

      const artist = (body.artist) ? body.artist : song.artist
      const title = (body.title) ? body.title : song.title
      const album = (body.album) ? body.album : song.album
      const artwork = (req.files.artwork) ? req.files.artwork[0].filename : song.artwork
      const filename = (req.files.song) ? req.files.song[0].filename : song.filename

      const songInfo = {
        artist: artist,
        title: title,
        album: album,
        artwork: artwork,
        filename: filename
      }

      return song.update(songInfo, (err) => {
        if (err) return res.status(400).send()
        if (req.files.song) {
          fs.unlinkSync(__dirname+'/uploads/'+song.filename)
          console.log('deleted: '+song.filename);
        }
        return res.status(200).send()
      })
    })
  })
})

module.exports = { song: router, songAuth: routerAuth }
