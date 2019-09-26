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

  User.findOne({ email: email }, (err, user) => {
    if (err) return res.status(400).send()
    if (user == null) return res.status(401).send()

    return user.comparePassword(password, (err, isMatch) => {
      if (err) return res.status(400).send()
      if (!isMatch) return res.status(401).send()

      const privateKey = fs.readFileSync(env.private_key)
      const token = jwt.sign({ email: user.email }, privateKey)

      return res.status(200).json({ 'token': 'JWT '+token })
    })
  })
})


module.exports = router
