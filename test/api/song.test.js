const express = require('express')
const app = require('../../server/api')
const request = require('supertest')
const assert = require('assert')
const fs = require('fs')


app.use(express.json())
// app.use(express.urlencoded({ extended: true }));


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
  test('GET songs', () =>{
    return request(app)
            .get('/api/v2/song')
            .expect(200)
            .then(res => {
              assert(res.body.length === 3)
            })
  })

  test('upload song', async () =>{
    const token = await getToken()

    const songInfo = {
      artist: 'test4',
      title: 'test4',
      album: 'album4'
    }

    return request(app)
            .post('/api/v2/song/upload')
            .set('Authorization', token)
            .set('Content-Type', 'multipart/form-data')
            .field('songInfo', JSON.stringify(songInfo))
            .attach('song', __dirname+'/files/test.wav')
            .attach('artwork', '')
            .expect(200)
  })

  test('upload song with artwork', async () =>{
    const token = await getToken()

    const songInfo = {
      artist: 'test4',
      title: 'test4',
      album: 'album4'
    }

    return request(app)
            .post('/api/v2/song/upload')
            .set('Authorization', token)
            .set('Content-Type', 'multipart/form-data')
            .field('songInfo', JSON.stringify(songInfo))
            .attach('song', __dirname+'/files/test.wav')
            .attach('artwork', __dirname+'/files/test.png')
            .expect(200)
  })

  test('upload song without songInfo', async () =>{
    const token = await getToken()

    const songInfo = {
      artist: 'test4',
      title: 'test4',
      album: 'album4'
    }

    return request(app)
            .post('/api/v2/song/upload')
            .set('Authorization', token)
            .set('Content-Type', 'multipart/form-data')
            .attach('song', __dirname+'/files/test.wav')
            .attach('artwork', __dirname+'/files/test.png')
            .expect(400)
  })

  test('upload song without song', async () =>{
    const token = await getToken()

    const songInfo = {
      artist: 'test4',
      title: 'test4',
      album: 'album4'
    }

    return request(app)
            .post('/api/v2/song/upload')
            .set('Authorization', token)
            .set('Content-Type', 'multipart/form-data')
            .field('songInfo', JSON.stringify(songInfo))
            .attach('artwork', __dirname+'/files/test.png')
            .expect(400)
  })
})
