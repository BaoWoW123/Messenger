const index = require('../routes/index')
const request = require('supertest')
const express = require('express')
const app = express()

//recreate new express app, not touching app.js
app.use(express.urlencoded({ extended:false }))
app.use("/", index)

describe('basic GET routes works', ()=> {

    test('index route', done => {
        request(app)
        .get('/')
        .expect('Content-Type', /json/)
        .expect({title: 'Index'})
        .expect(200, done)
    });
    test('signup route', done => {
        request(app)
        .get('/signup')
        .expect('Content-Type', /json/)
        .expect({title: 'Sign up'})
        .expect(200, done)
    });
    test('login route', done => {
        request(app)
        .get('/login')
        .expect('Content-Type', /json/)
        .expect({title: 'Log in'})
        .expect(200, done)
    });
})

describe('POST routes works with inputs', ()=> {

    test('signup route', done => {
        request(app)
        .post('/signup')
        .expect('Content-Type', /json/)
        .expect({title: 'Sign up POST'})
        .expect(200, done)
    });
    test('login route', done => {
        request(app)
        .post('/login')
        .expect('Content-Type', /json/)
        .expect({title: 'Log in POST'})
        .expect(200, done)
    });
})