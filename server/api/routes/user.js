const express = require('express')
const router = express.Router()
const Model = require('../models')


router.put('/', (req, res) => {
  const email = req.user.email
  const password = req.body.password
  let newEmail = req.body.newEmail
  let newPassword = req.body.newPassword

  Model('User').findOne({ email: email }, (err, user) => {
    if (err) return res.status(400).send()
    if (!user) return res.status(400).send()

    return user.comparePassword(password, (err, isMatch) => {
      if (err) return res.status(400).send()
      if (!isMatch) return res.status(400).send()

      return Model('User').deleteOne({ email: email }, (err) => {
        if (err) return res.status(400).send()
        
        newEmail = (!newEmail) ? email : newEmail
        newPassword = (!newPassword) ? password : newPassword

        return Model('User').create({ email: newEmail, password: newPassword }, (err) => {
          if (err) return res.status(401).send()
          return res.status(200).send()
        })
      })
    })
  })
})

module.exports = router
