var express = require('express');
var router = express.Router();
const {User, Message } = require('../db')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({ title: 'Index' });
});

router.get('/signup', function(req, res, next) {
  res.json({ title: 'Sign up' });
});

router.get('/login', function(req, res, next) {
  res.json({ title: 'Log in' });
});

router.post('/signup', async function(req, res, next) {
  const {username, email, password, confirmPassword} = req.body;
  if (password !== confirmPassword) return res.status(401).json({msg: 'Passwords do not match'});
  const fetchedUser = await User.findOne({username: username})
  if (fetchedUser) return res.status(401).json({msg:'User already exists'});
  const user = new User({
    username:username,
    email:email,
    password:password,
  })
  //await user.save();  not saved for testing purposes
  res.json({ title: 'Sign up POST', user:user });
});

router.post('/login', function(req, res, next) {
  res.json({ title: 'Log in POST' });
});

module.exports = router;
