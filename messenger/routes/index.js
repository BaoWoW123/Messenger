var express = require('express');
var router = express.Router();

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

router.post('/signup', function(req, res, next) {
  res.json({ title: 'Sign up POST' });
});

router.post('/login', function(req, res, next) {
  res.json({ title: 'Log in POST' });
});

module.exports = router;
