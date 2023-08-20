const index = require('../routes/index')
const request = require('supertest')
const express = require('express')
const app = express()

//recreate new express app, not touching app.js
app.use(express.urlencoded({ extended:false }))
app.use("/", index)
/* 
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
        .expect({title: 'Sign Up'})
        .expect(200, done)
    });
    test('login route', done => {
        request(app)
        .get('/login')
        .expect('Content-Type', /json/)
        .expect({title: 'Log In'})
        .expect(200, done)
    });
}) */

/* describe('POST Signup With Various Inputs', ()=> {

    test('valid inputs', async () => {
        const user = {
            username: 'Bobby', 
            email:'email123@gmail.com',
            password:'12345', 
            confirmPassword: '12345',
        }
        const res = await request(app).post('/signup').type('form').send(user);
        expect(res.statusCode).toBe(200)
        expect(res.body.user._id).toBeDefined();
        expect(res.body.user.email).toBe('email123@gmail.com');
    });

    test('Incorrect password', async () => {
        const user = {
            username: 'Bobby', 
            email:'email123@gmail.com',
            password:'12345', 
            confirmPassword: '123456',
        }
        const res = await request(app).post('/signup').type('form').send(user);
        expect(res.statusCode).toBe(401)
    });

    test('Taken username', async () => {
        const user = {
            username: 'taken', 
            email:'email123@gmail.com',
            password:'12345', 
            confirmPassword: '12345',
        }
        const res = await request(app).post('/signup').type('form').send(user);
        expect(res.statusCode).toBe(401)
    });

    test('Taken email', async () => {
        const user = {
            username: 'Bobby', 
            email:'taken@gmail.com',
            password:'12345', 
            confirmPassword: '12345',
        }
        const res = await request(app).post('/signup').type('form').send(user);
        expect(res.statusCode).toBe(401)
    });
}) */

describe('POST Login Route', () => {
    test('Valid Login Inputs', async () => {
        const user = {
            username: 'taken', 
            email:'taken@gmail.com',
            password:'taken', 
        }
        const res = await request(app).post('/login').type('form').send(user);
        expect(res.header['content-type']).toMatch(/json/)
        expect(res.body).toMatchObject({msg: 'Welcome taken'})
        expect(res.statusCode).toBe(200)
    });
    test('Invalid Username', async () => {
        const user = {
            username: 'Bobby', 
            email:'taken@gmail.com',
            password:'taken', 
        }
        const res = await request(app).post('/login').type('form').send(user);
        expect(res.header['content-type']).toMatch(/json/)
        expect(res.body).toMatchObject({msg: 'Could not find username'})
        expect(res.statusCode).toBe(401)
    });
    test('Invalid Email', async () => {
        const user = {
            username: 'taken', 
            email:'wrong@gmail.com',
            password:'taken', 
        }
        const res = await request(app).post('/login').type('form').send(user);
        expect(res.header['content-type']).toMatch(/json/)
        expect(res.body).toMatchObject({msg: 'Invalid email'})
        expect(res.statusCode).toBe(401)
    });
    test('Invalid Password', async () => {
        const user = {
            username: 'taken', 
            email:'taken@gmail.com',
            password:'wrong', 
        }
        const res = await request(app).post('/login').type('form').send(user);
        expect(res.header['content-type']).toMatch(/json/)
        expect(res.body).toMatchObject({msg: 'Wrong password'})
        expect(res.statusCode).toBe(401)
    })
})

describe('Cookies created', () => {
    test('Token cookie on POST signup', async () => {
        const user = {
            username: 'Bobby', 
            email:'email@gmail.com',
            password:'12345', 
            confirmPassword: '12345',
        }
        const res = await request(app).post('/signup').type('form').send(user);
        const cookieHeader = res.header['set-cookie'][0]; 

        expect(cookieHeader).toBeDefined();
        expect(cookieHeader).toContain('HttpOnly');
        expect(cookieHeader).toContain('Secure');
        expect(res.statusCode).toBe(200)
    });
    test('Token cookie on POST login', async () => {
        const user = {
            username: 'taken', 
            email:'taken@gmail.com',
            password:'taken', 
        }
        const res = await request(app).post('/login').type('form').send(user);
        const cookieHeader = res.header['set-cookie'][0]; 

        expect(cookieHeader).toBeDefined();
        expect(cookieHeader).toContain('HttpOnly');
        expect(cookieHeader).toContain('Secure');
        expect(res.statusCode).toBe(200)
    });
})