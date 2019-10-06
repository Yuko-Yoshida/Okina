const async = require('async')
const express = require('express')
const fs = require('fs')
const zipstream = require('zip-stream')
let res = express.response


res.zip = function(files, filename, cb) {
  if (typeof filename === 'function') {
    cb = filename
    filename = undefined
  }

  if (typeof filename === 'undefined') {
    filename = "attachment.zip"
  }

  cb = cb || function() {}

  this.header('Content-Type', 'application/zip')
  this.header('Content-Disposition', 'attachment; filename="' + filename + '.zip"')

  const zip = zipstream(exports.options)
  zip.pipe(this) // res is a writable stream

  const addFile = function(file, cb) {
    zip.entry(file.data, { name: file.name }, cb)
  }

  async.forEachSeries(files, addFile, function(err) {
    if (err) return cb(err)
    zip.finalize()
    cb(null, zip.getBytesWritten())
  });
};
