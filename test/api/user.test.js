const express = require('express')
const app = require('../../server/api')
const request = require('supertest')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


function getToken(query) {
  return request(app)
          .post('/api/v1/login')
          .send(query)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .then((res) => res.body.token)
}

describe('api/user.js', () => {
  test('PUT with invalid token', async () =>{
    const token = 'hogehoge'
    const param = {
      'newEmail': 'test@mail.com',
      'password': 'password',
      'newPassword': 'password'
    }
    return request(app)
      .put('/api/v1/user')
      .send(param)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .expect(401)
  })

  test('PUT without update', async () =>{
    const token = await getToken({
      'email': 'test@mail.com',
      'password': 'password'
    })
    const param = {
      'newEmail': 'test@mail.com',
      'password': 'password',
      'newPassword': 'password'
    }
    return request(app)
      .put('/api/v1/user')
      .send(param)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .expect(200)
  })

  test('PUT with invalid password', async () =>{
    const token = await getToken({
      'email': 'test@mail.com',
      'password': 'password'
    })
    const param = {
      'newEmail': 'test@mail.com',
      'password': 'hoge',
      'newPassword': 'password'
    }
    return request(app)
      .put('/api/v1/user')
      .send(param)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .expect(400)
  })

  test('PUT with empty info', async () =>{
    const token = await getToken({
      'email': 'test@mail.com',
      'password': 'password'
    })
    const param = {
      'newEmail': '',
      'password': 'password',
      'newPassword': ''
    }
    return request(app)
      .put('/api/v1/user')
      .send(param)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .expect(200)
  })

  test('PUT with new password', async () =>{
    const token = await getToken({
      'email': 'test@mail.com',
      'password': 'password'
    })
    const param = {
      'newEmail': 'test@mail.com',
      'password': 'password',
      'newPassword': 'pass'
    }
    return request(app)
      .put('/api/v1/user')
      .send(param)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .expect(200)
      .then(async (res) => {
        const newToken = await getToken({
          'email': 'test@mail.com',
          'password': 'pass'
        })
        // return expect(newToken).stringContaining('JWT')
      })
  })

  test('PUT with new email', async () =>{
    const token = await getToken({
      'email': 'test@mail.com',
      'password': 'pass'
    })
    const param = {
      'newEmail': 'hoge@mail.com',
      'password': 'pass',
      'newPassword': 'pass'
    }
    return request(app)
      .put('/api/v1/user')
      .send(param)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .expect(200)
      .then(async (res) => {
        const newToken = await getToken({
          'email': 'hoge@mail.com',
          'password': 'pass'
        })
        // return expect(newToken).stringContaining('JWT')
      })
  })

  test('PUT with new info', async () =>{
    const token = await getToken({
      'email': 'hoge@mail.com',
      'password': 'pass'
    })
    const param = {
      'newEmail': 'test@mail.com',
      'password': 'pass',
      'newPassword': 'password'
    }
    return request(app)
      .put('/api/v1/user')
      .send(param)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .expect(200)
      .then(async (res) => {
        const newToken = await getToken({
          'email': 'test@mail.com',
          'password': 'password'
        })
        // return expect(newToken).stringContaining('JWT')
      })
  })
})
