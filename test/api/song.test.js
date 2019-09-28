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

  test('upload song with lack of songInfo', async () =>{
    const token = await getToken()

    const songInfo = {
      artist: 'test4',
      album: 'album4'
    }

    return request(app)
            .post('/api/v2/song/upload')
            .set('Authorization', token)
            .set('Content-Type', 'multipart/form-data')
            .field('songInfo', JSON.stringify(songInfo))
            .attach('song', __dirname+'/files/test.wav')
            .attach('artwork', __dirname+'/files/test.png')
            .expect(400)
  })

  test('update song', async () =>{
    const token = await getToken()

    const song = await request(app)
                          .get('/api/v2/song')
                          .then(res => {
                            return res.body.slice(-1)[0] // get last one
                          })

    const songInfo = {
      artist: 'test40',
      title: 'test40',
      album: 'album40'
    }

    return request(app)
            .put('/api/v2/song/'+song.filename)
            .set('Authorization', token)
            .set('Content-Type', 'multipart/form-data')
            .field('songInfo', JSON.stringify(songInfo))
            .attach('song', __dirname+'/files/test.wav')
            .attach('artwork', __dirname+'/files/test.png')
            .expect(200)
  })

  test('update song but worng id', async () =>{
    const token = await getToken()

    const song = await request(app)
                          .get('/api/v2/song')
                          .then(res => {
                            return res.body.slice(-1)[0] // get last one
                          })

    const songInfo = {
      artist: 'test40',
      title: 'test40',
      album: 'album40'
    }

    return request(app)
            .put('/api/v2/song/'+'hogehoge')
            .set('Authorization', token)
            .set('Content-Type', 'multipart/form-data')
            .field('songInfo', JSON.stringify(songInfo))
            .attach('song', __dirname+'/files/test.wav')
            .attach('artwork', __dirname+'/files/test.png')
            .expect(400)
  })

  test('update song info', async () =>{
    const token = await getToken()

    const song = await request(app)
                          .get('/api/v2/song')
                          .then(res => {
                            return res.body.slice(-1)[0] // get last one
                          })

    const songInfo = {
      artist: 'test404',
      title: 'test404',
      album: 'album404'
    }

    return request(app)
            .put('/api/v2/song/'+song.filename)
            .set('Authorization', token)
            .set('Content-Type', 'multipart/form-data')
            .field('songInfo', JSON.stringify(songInfo))
            .expect(200)
  })
})
