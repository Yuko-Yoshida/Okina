const express = require('express')
const router = express.Router()
const Model = require('../models')
const environment = process.env.NODE_ENV || 'development'


router.post('/new', (req, res) => {
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

router.put('/', (req, res) => {
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
    Model('Artist').deleteOne({}, (err, artist) => {
      if (err) return res.status(400).send()
      return res.status(200).send()
    })
  })
}

module.exports = router
