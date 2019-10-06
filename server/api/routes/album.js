const express = require('express')
const router = express.Router()
const routerAuth = express.Router()
const Model = require('../models')
const multer = require('multer')
const fs = require('fs')
const zip = require('../modules/zip')
const ffmpeg = require('fluent-ffmpeg')
const uuidv4 = require('uuid/v4')
const NodeID3 = require('node-id3')


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


function applyTags(file, info, cb) {
  const tags = {
    title: info.title,
    artist: info.artist,
    album: info.album,
    APIC: info.artwork
  }

  return NodeID3.write(tags, file, (err, buffer) => {
    if (err) cb(err, null)
    cb(null, buffer)
  })
}


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

router.get('/:id', (req, res) => {
  Model('Album').findOne({ _id: req.params.id }, (err, album) => {
    if (err) return res.status(400).send()
    if (!album) return res.status(400).send()

    const albumInfos = {
      id: album._id,
      artist: album.artist,
      title: album.title,
      songs: album.songs,
      artwork: album.artwork,
      date: album.date
    }
    res.status(200).json(albumInfos)
  })
})

router.get('/:id/download', (req, res) => {
  Model('Album').findOne({ _id: req.params.id }, (err, album) => {
    if (err) return res.status(400).send()
    if (!album) return res.status(400).send()

    return Model('Song').find({ _id: album.songs }, async (err, songs) => {
      if (err) return res.status(400).send()
      if (!songs) return res.status(400).send()
      if (album.songs.length !== songs.length) return res.status(400).send()

      const toMp3 = (song) => {
        return new Promise((resolve, reject) => {
          const tmpname = __dirname+'/uploads/'+song.filename+uuidv4()
          ffmpeg(__dirname+'/uploads/'+song.filename)
            .output(tmpname)
            .audioBitrate('320k')
            .audioChannels(2)
            .audioCodec('libmp3lame')
            .format('mp3')
            .on('error', (err) => reject(err))
            .on('end', () => {
              const buffer = fs.readFileSync(tmpname)
              applyTags(buffer, song, (err, file) => {
                if (err) reject(err)
                fs.unlinkSync(tmpname)
                resolve({ title: song.title, file: file })
              })
            })
            .run()
        })
      }
      const promises = songs.map(song => toMp3(song))
      const mp3s = await Promise.all(promises)

      const zipFile = mp3s.map((song) => {
        return {
          name: song.title+'.mp3',
          data: song.file
        }
      })

      if (album.artwork) {
        zipFile.push({
          name: 'artwork.png',
          data: fs.createReadStream(__dirname+'/uploads/'+album.artwork)
        })
      }

      return res.status(200).zip(zipFile, album.title)
    })
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
