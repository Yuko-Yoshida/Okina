const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')
const SALT_FACTOR = 10

const UserSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true }
})

UserSchema.pre('save', function(next) {
  const user = this
  // Only hase the password if it has been modified or created.
  if (!user.isModified('password')) return next()

  bcrypt.genSalt(SALT_FACTOR, (err, salt) =>{
    if (err) return next(err)

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err)

      user.password = hash
      next()
    })
  })
})

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) return cb(err)
    return cb(null, isMatch)
  })
}

module.exports = UserSchema
