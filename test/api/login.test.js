const express = require('express')
const app = require('../../server/api')
const request = require('supertest')

app.use(express.json())


describe('api/login.js', () => {
  test('Worng method GET', () =>{
    return request(app).get('/api/v1/login').expect(404)
  })
  test('Worng method PUT', () =>{
    return request(app).put('/api/v1/login').expect(404)
  })
  test('Worng method DELETE', () =>{
    return request(app).delete('/api/v1/login').expect(404)
  })
  test('POST with no data', () =>{
    return request(app).post('/api/v1/login').expect(401)
  })
  test('POST with worng email', () =>{
    return request(app)
            .post('/api/v1/login')
            .send({
              'email': 'hoge@mail.com',
              'password': 'password'
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect(401)
  })
  test('POST with worng password', () =>{
    return request(app)
            .post('/api/v1/login')
            .send({
              'email': 'test@mail.com',
              'password': 'hoge'
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect(401)
  })
  test('POST with correct info', () =>{
    return request(app)
            .post('/api/v1/login')
            .send({
              'email': 'test@mail.com',
              'password': 'password'
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect(200)
  })
})
