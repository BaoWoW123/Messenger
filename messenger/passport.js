const passport = require('passport')
const { Strategy } = require('passport-jwt');
const { User } = require('./db');
require('dotenv').config();
const options = {
    jwtFromRequest: req => req.cookies.jwt,
    secretOrKey: process.env.SECRET_KEY,
}

passport.use( new Strategy(options, async(payload, done)=> {
    try {
        const user = await User.findById(payload.user);
        if (user) {
            return done(null, true)
        }
        return done(null, false)
    } catch(err) {
        done(err, false)
    }
}))

module.exports = passport;