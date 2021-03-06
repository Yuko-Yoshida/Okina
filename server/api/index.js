const express = require('express')
const app = express()
const passport = require('passport')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JWTStrategy = passportJWT.Strategy
const fs = require('fs')
const environment = process.env.NODE_ENV || 'development'
const env = require(`../../env.${environment}.js`)
const errorhandler = require('errorhandler');


app.use(express.json())
app.use(errorhandler())
app.use(express.raw({ type: 'audio/wav', limit: '50mb' }))



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
    return done(undefined, jwtPayload)
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
const { user, userAuth } = require('./routes/user')
const { artist, artistAuth } = require('./routes/artist')
const { song, songAuth } = require('./routes/song')
const { album, albumAuth } = require('./routes/album')

app.use('/api/v2/login', login)
app.use('/api/v2/user', user)
app.use('/api/v2/user', jwt, userAuth)
app.use('/api/v2/artist', artist)
app.use('/api/v2/artist', jwt, artistAuth)
app.use('/api/v2/song', song)
app.use('/api/v2/song', jwt, songAuth)
app.use('/api/v2/album', album)
app.use('/api/v2/album', jwt, albumAuth)

module.exports = app
