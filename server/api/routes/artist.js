const express = require('express')
const router = express.Router()
const routerAuth = express.Router()
const Model = require('../models')
const multer = require('multer')
const fs = require('fs')
const environment = process.env.NODE_ENV || 'development'


const storage = multer.diskStorage({
  destination: function(req, res, cb) {
    const dist = __dirname+'/uploads'
    if (!fs.existsSync(dist)) fs.mkdirSync(dist)
    cb(null, dist)
  }
})

const upload = multer({ storage: storage }).single('avater')


router.get('/', (req, res) => {
  Model('Artist').findOne({}, (err, artist) => {
    if (err) res.status(400).send()

    const { name, description, avater } = artist
    res.status(200).json({ name, description, avater })
  })
})

routerAuth.post('/new', (req, res) => {
  Model('Artist').count({}, (err, count) => {
    if (err) return res.status(400).send()
    if (count > 0) return res.status(400).send()

    const name = req.body.name
    const description = req.body.description

    return Model('Artist').create({ name: name, description: description }, (err) => {
      if (err) return res.status(400).send()
      return res.status(200).send()
    })
  })
})

routerAuth.post('/avater', (req, res) => {
  upload(req, res, (err) => {
    if (err) return res.status(400).send()
    if (!req.file) return res.status(400).send()

    return Model('Artist').findOne({}, (err, artist) => {
      if (err) return res.status(400).send()
      return artist.updateOne({ avater: req.file.filename }, (err) => {
        if (err) return res.status(400).send()
        return res.status(200).send()
      })
    })
  })
})

routerAuth.put('/', (req, res) => {
  const name = req.body.name
  const description = req.body.description

  Model('Artist').findOne({}, (err, artist) => {
    if (err) return res.status(400).send()

    return artist.update({ name: name, description: description }, (err) => {
      if (err) return res.status(400).send()
      return res.status(200).send()
    })
  })
})

if (environment === 'test') {
  router.delete('/', (req, res) => {
    Model('Artist').deleteOne({}, (err) => {
      if (err) return res.status(400).send()
      return res.status(200).send()
    })
  })
}

module.exports = { artist: router, artistAuth: routerAuth }
