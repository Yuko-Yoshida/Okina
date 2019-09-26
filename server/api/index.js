const express = require('express')
const app = express()
const passport = require('passport')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JWTStrategy = passportJWT.Strategy
const fs = require('fs')
const environment = process.env.NODE_ENV || 'development'
const env = require(`../../env.${environment}.js`)


app.use(express.json())


const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'),
  secretOrKey: fs.readFileSync(env.private_key),
  session: false,
  jsonwebtoken: {
    algorithm: 'RS256'
  }
}

passport.use(new JWTStrategy(opts, (jwtPayload, done) => {
  if (jwtPayload === undefined || jwtPayload.email === undefined) {
    return done('Invalid JWT Payload', false)
  }
  else {
    return done(undefined, true)
  }
}))

const jwt = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) return next(err)
    if (!user) return res.status(401).send()

    req.user = user
    next()
  })(req, res, next)
}

const login = require('./routes/login')
const user = require('./routes/user')

app.use('/api/v1/login', login)
app.use('/api/v1/user', jwt, user)

module.exports = app
