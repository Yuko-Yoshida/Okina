const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')
const SALT_FACTOR = 10

const UserSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true }
})

function encryptPassword(next) {
  const user = this

  bcrypt.genSalt(SALT_FACTOR, (err, salt) =>{
    if (err) return next(err)

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err)

      user.password = hash
      next()
    })
  })
}

UserSchema.pre('save', encryptPassword)

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) return cb(err)
    return cb(null, isMatch)
  })
}

module.exports = UserSchema
