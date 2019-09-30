const async = require('async')
const express = require('express')
const fs = require('fs')
const ffmpeg = require('fluent-ffmpeg')
let res = express.response


res.mp3 = function(file, filename, cb) {
  if (typeof filename === 'function') {
    cb = filename
    filename = undefined
  }

  if (typeof filename === 'undefined') {
    filename = "attachment.mp3"
  }

  cb = cb || function() {}

  this.header('Content-Type', 'audio/mpeg')
  this.header('Content-Disposition', 'attachment; filename="' + filename + '"')

  ffmpeg(file)
    .audioCodec('libmp3lame')

}
