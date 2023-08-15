const index = require('../routes/index')
const request = require('supertest')
const express = require('express')
const app = express()

//recreate new express app, not touching app.js
app.use(express.urlencoded({ extended:false }))
app.use("/", index)


test('index route works', done => {
    request(app)
      .get('/')
      .expect('Content-Type', /json/)
      .expect({title: 'Index'})
      .expect(200, done)
})