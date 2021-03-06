const express = require('express')
const router = express.Router()
const routerAuth = express.Router()
const Model = require('../models')
const multer = require('multer')
const fs = require('fs')
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
  { name: 'song', maxCount: 1 },
  { name: 'songInfo', maxCount: 1 },
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
  Model('Song').find({}, (err, songs) => {
    if (err) res.status(400).send()

    const songInfos = songs.map((song) => {
      return {
        id: song._id,
        artist: song.artist,
        title: song.title,
        album: song.album,
        description: song.description,
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
      description: song.description,
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

    const tmpname = __dirname+'/uploads/'+song.filename+uuidv4()

    return ffmpeg(__dirname+'/uploads/'+song.filename)
            .output(tmpname)
            .audioBitrate('128k')
            .audioChannels(2)
            .audioCodec('libmp3lame')
            .format('mp3')
            .on('error', (err) => res.status(400).send())
            .on('end', () => {
              res.set('Content-Type', 'audio/mp3')
              res.set('Content-Length', fs.statSync(tmpname).size)

              const buffer = fs.readFileSync(tmpname)
              fs.unlinkSync(tmpname)
              return res.status(200).send(buffer)
            })
            .run()
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

router.get('/:id/download', (req, res) => {
  Model('Song').findOne({ _id: req.params.id }, (err, song) => {
    if (err) return res.status(400).send()
    if (!song) return res.status(400).send()

    const tmpname = __dirname+'/uploads/'+song.filename+uuidv4()

    return ffmpeg(__dirname+'/uploads/'+song.filename)
            .output(tmpname)
            .audioBitrate('320k')
            .audioChannels(2)
            .audioCodec('libmp3lame')
            .format('mp3')
            .on('error', (err) => res.status(400).send())
            .on('end', () => {
              res.set('Content-Type', 'audio/mp3')
              res.set('Content-Disposition', 'attachment; filename="' + song.title + '.mp3"')

              const buffer = fs.readFileSync(tmpname)
              fs.unlinkSync(tmpname)

              return applyTags(buffer, song, (err, file) => {
                if (err) return res.status(400).send()
                return res.status(200).send(file)
              })
            })
            .run()
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
      description: body.description,
      artwork: artwork,
      filename: req.files.song[0].filename
    }
    const conditions = () => {
      return songInfo.artist === '' ||
             songInfo.title === '' ||
             typeof songInfo.artist === 'undefined' ||
             typeof songInfo.title === 'undefined'
    }
    if (conditions()) return res.status(400).send()

    return Model('Song').create(songInfo, (err, song) => {
      if (err) return res.status(400).send()

      // to wav
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
      const description = (body.description) ? body.description : song.description
      const artwork = (req.files.artwork) ? req.files.artwork[0].filename : song.artwork
      const filename = (req.files.song) ? req.files.song[0].filename : song.filename

      const songInfo = {
        artist: artist,
        title: title,
        album: album,
        description: description,
        artwork: artwork,
        filename: filename
      }

      return song.update(songInfo, (err) => {
        if (err) return res.status(400).send()
        if (req.files.song) {
          fs.unlinkSync(__dirname+'/uploads/'+song.filename)
          // to wav
          return ffmpeg(__dirname+'/uploads/'+songInfo.filename)
                  .output(__dirname+'/uploads/'+songInfo.filename+'.wav')
                  .on('error', (err) => res.status(400).send())
                  .on('end', () => {
                    fs.renameSync(__dirname+'/uploads/'+songInfo.filename+'.wav',
                                  __dirname+'/uploads/'+songInfo.filename)
                    return res.status(200).send()
                  })
                  .run()
        }
        else {
          return res.status(200).send()
        }
      })
    })
  })
})

routerAuth.delete('/:id', (req, res) => {
  Model('Song').findOne({ _id: req.params.id }, (err, song) => {
    if (err) return res.status(400).send()
    if (!song) return res.status(400).send()

    const id = song._id
    const filename = song.filename
    const artwork = song.artwork

    return Model('Song').deleteOne({ _id: id }, (err) => {
      if (err) return res.status(400).send()

      if (filename && fs.existsSync(__dirname+'/uploads/'+filename)) {
        fs.unlinkSync(__dirname+'/uploads/'+filename)
      }
      if (artwork && fs.existsSync(__dirname+'/uploads/'+artwork)) {
        fs.unlinkSync(__dirname+'/uploads/'+artwork)
      }

      return res.status(200).send()
    })
  })
})

module.exports = { song: router, songAuth: routerAuth }
