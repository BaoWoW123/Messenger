const index = require('../routes/index')
const request = require('supertest')
const express = require('express')
const { User } = require('../db')
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

    test('signup route', async () => {
        const user = {
            username: 'Bob', 
            email:'email123@gmail.com',
            password:'12345', 
            confirmPassword: '12345',
        }
        const res = await request(app).post('/signup').type('form').send(user);
        expect(res.statusCode).toBe(200)
        expect(res.body.user._id).toBeDefined();
        expect(res.body.user.email).toBe('email123@gmail.com');
    });

    test('signup route with incorrect password', async () => {
        const user = {
            username: 'Bob', 
            email:'email123@gmail.com',
            password:'12345', 
            confirmPassword: '123456',
        }
        const res = await request(app).post('/signup').type('form').send(user);
        expect({ msg: 'Passwords do not match'})   
        expect(res.statusCode).toBe(401)
        
    });

    test('login route', done => {
        request(app)
        .post('/login')
        .expect('Content-Type', /json/)
        .expect({title: 'Log in POST'})
        .expect(200, done)
    });
})