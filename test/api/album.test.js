const express = require('express')
const app = require('../../server/api')
const request = require('supertest')
const assert = require('assert')
const fs = require('fs')


app.use(express.json())
app.use(express.urlencoded({ extended: true }));


function getToken() {
  return request(app)
          .post('/api/v2/login')
          .send({
            'email': 'test@mail.com',
            'password': 'password'
          })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .then((res) => res.body.token)
}

describe('api/song.js', () => {

  test('GET albums', () => {
    return request(app)
            .get('/api/v2/album')
            .expect(200)
            .then(res => {
              console.log(res.body);
              assert(res.body.length === 2)
            })
  })
})
