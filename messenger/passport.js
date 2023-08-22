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
        const user = await User.findById(payload.user).select('-password').exec();
        if (user) {
            return done(null, user)
        }
        return done(null, false)
    } catch(err) {
        done(err, false)
    }
}))

passport.serializeUser((user, done) => {
    // Serialize user object to store in session (if needed)
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id, done) => {
    // Deserialize user object from session (if needed)
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });

module.exports = passport;