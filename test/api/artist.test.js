const express = require('express')
const app = require('../../server/api')
const request = require('supertest')
const assert = require('assert')


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

describe('api/artist.js', () => {
  test('GET artist info', () =>{
    return request(app)
            .get('/api/v2/artist')
            .expect(200)
            .then(res => {
              assert(res.body.name, 'test')
              assert(res.body.description, 'hogehgoe')
            })
  })

  test('POST artist info but it is already exist', async () =>{
    const token = await getToken()

    return request(app)
            .post('/api/v2/artist/new')
            .send({
              'name': 'hoge',
              'description': 'piyo'
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .expect(400)
  })

  test('POST artist info', async () =>{
    const token = await getToken()

    await request(app)
            .delete('/api/v2/artist')
            .set('Authorization', token)

    await request(app)
            .post('/api/v2/artist/new')
            .send({
              'name': 'hoge',
              'description': 'piyo'
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .expect(200)

    return request(app)
            .get('/api/v2/artist')
            .expect(200)
            .then(res => {
              assert(res.body.name, 'hoge')
              assert(res.body.description, 'piyo')
            })
  })

  test('PUT artist info', async () =>{
    const token = await getToken()

    await request(app)
            .put('/api/v2/artist')
            .send({
              'name': 'udon',
              'description': 'tewi'
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .expect(200)

    return request(app)
            .get('/api/v2/artist')
            .expect(200)
            .then(res => {
              assert(res.body.name, 'udon')
              assert(res.body.description, 'tewi')
            })
  })
})
