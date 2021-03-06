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

afterAll(() => {
  // delete uploads dir after tests.
  const dir = __dirname+'/../../server/api/routes/uploads/'
  const targets = fs.readdirSync(dir)
  targets.map(target => fs.unlinkSync(dir+target))
  return fs.rmdirSync(dir)
})

describe('api/song.js', () => {

  test('GET albums', () => {
    return request(app)
            .get('/api/v2/album')
            .expect(200)
            .then(res => {
              assert(res.body.length === 2)
            })
  })

  test('POST album', async () => {
    const token = await getToken()

    const albumInfo = {
      artist: 'test4',
      title: 'test4',
      description: 'test4',
      songs: ['album4', 'album4', 'album4']
    }

    return request(app)
            .post('/api/v2/album/upload')
            .set('Authorization', token)
            .set('Content-Type', 'multipart/form-data')
            .field('albumInfo', JSON.stringify(albumInfo))
            .attach('artwork', '')
            .expect(200)
            .then(res => {
              console.log(res.body.id);
            })
  })

  test('POST album but lack of info', async () => {
    const token = await getToken()

    const albumInfo = {
      title: 'test4',
      description: 'test4',
      songs: ['album4', 'album4', 'album4']
    }

    return request(app)
            .post('/api/v2/album/upload')
            .set('Authorization', token)
            .set('Content-Type', 'multipart/form-data')
            .field('albumInfo', JSON.stringify(albumInfo))
            .attach('artwork', '')
            .expect(400)
  })

  test('POST album with artwork', async () => {
    const token = await getToken()

    const albumInfo = {
      artist: 'test4',
      title: 'test4',
      description: 'test4',
      songs: ['album4', 'album4', 'album4']
    }

    return request(app)
            .post('/api/v2/album/upload')
            .set('Authorization', token)
            .set('Content-Type', 'multipart/form-data')
            .field('albumInfo', JSON.stringify(albumInfo))
            .attach('artwork', __dirname+'/files/test.png')
            .expect(200)
            .then(res => {
              console.log(res.body.id);
            })
  })

  test('update album', async () => {
    const token = await getToken()

    const album = await request(app)
                          .get('/api/v2/album')
                          .then(res => {
                            return res.body.slice(-1)[0] // get last one
                          })

    const albumInfo = {
      artist: 'hoge4',
      title: 'hoge4',
      description: 'hoge4',
      songs: ['hoge4', 'hoge4', 'hoge4']
    }

    return request(app)
            .put('/api/v2/album/'+album.id)
            .set('Authorization', token)
            .set('Content-Type', 'multipart/form-data')
            .field('albumInfo', JSON.stringify(albumInfo))
            .attach('artwork', __dirname+'/files/test.png')
            .expect(200)
  })

  test('update album but album not found', async () => {
    const token = await getToken()

    const album = await request(app)
                          .get('/api/v2/album')
                          .then(res => {
                            return res.body.slice(-1)[0] // get last one
                          })

    const albumInfo = {
      artist: 'hoge4',
      title: 'hoge4',
      description: 'hoge4',
      songs: ['hoge4', 'hoge4', 'hoge4']
    }

    return request(app)
            .put('/api/v2/album/123124')
            .set('Authorization', token)
            .set('Content-Type', 'multipart/form-data')
            .field('albumInfo', JSON.stringify(albumInfo))
            .attach('artwork', __dirname+'/files/test.png')
            .expect(400)
  })

  test('Upload album then download that', async () => {
    jest.setTimeout(10000);

    const token = await getToken()

    const songInfo = {
      artist: 'test4',
      title: 'test4',
      album: 'album4'
    }

    const song = await request(app)
                        .post('/api/v2/song/upload')
                        .set('Authorization', token)
                        .set('Content-Type', 'multipart/form-data')
                        .field('songInfo', JSON.stringify(songInfo))
                        .attach('song', __dirname+'/files/test.wav')
                        .attach('artwork', '')
                        .expect(200)
                        .then(res => res.body)

    const albumInfo = {
      artist: 'hoge4',
      title: 'hoge4',
      description: 'hoge4',
      songs: [song.id]
    }

    const album = await request(app)
                          .post('/api/v2/album/upload')
                          .set('Authorization', token)
                          .set('Content-Type', 'multipart/form-data')
                          .field('albumInfo', JSON.stringify(albumInfo))
                          .attach('artwork', '')
                          .expect(200)
                          .then(res => res.body)

    return request(app)
            .get('/api/v2/album/'+album.id+'/download')
            .expect(200)
  })
})
