const express = require('express')
const router = express.Router()
const Model = require('../models')


router.post('/', (req, res) => {
  const email = req.body.email
  const password = req.body.password
  const retypePassword = req.body.retypePassword

  if (password !== retypePassword) res.status(400).send()

  Model('User').count({}, (err, count) => {
    if (err) return res.status(400).send()
    // is user already exist?
    if (count > 0) return res.status(400).send()

    return Model('User').create({ email: email, password: password }, (err) => {
      if (err) return res.status(400).send()
      return res.status(200).send()
    })
  })
})

module.exports = router
