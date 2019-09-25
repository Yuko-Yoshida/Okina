const express = require('express')
const router = express.Router()
const { User } = require('../models')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const environment = process.env.NODE_ENV || 'development'
const env = require(`../../../env.${environment}.js`)


router.post('/', (req, res) => {
  const email = req.body.email
  const password = req.body.password

  User.find({ email: email }, (err, user) => {
    if (err) res.status(400).send()

    user.comparePassword(password, (err, isMatch) => {
      if (err) res.status(400).send()
      if (!isMatch) res.status(401).send()

      const privateKey = fs.readFileSync(env.private_key)
      const token = jwt.sign({ email: user.email }, privateKey)

      res.status(200).json({ 'token': token })
    })
  })
})


module.exports = router
