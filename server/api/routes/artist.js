const express = require('express')
const router = express.Router()
const Model = require('../models')


router.get('/', (req, res) => {
  Model('Artist').findOne({}, (err, artist) => {
    if (err) res.status(400).send()

    const { name, description } = artist
    res.status(200).json({ name, description })
  })
})

module.exports = router
