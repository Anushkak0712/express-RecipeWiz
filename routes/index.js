var express = require('express');
const auth=require('../auth');
var router = express.Router();
const Recipe=require('../models/recipes')

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});
router.get('/login', function(req, res) {
  if(req.cookies.jwt) return res.redirect('/home');
  res.render('login');
});
router.get("/register", function (req, res) {
  if(req.cookies.jwt) return res.redirect('/home');
  res.render("register");
});


router.get('/logout', function(req, res, next) {
  try {
    res.clearCookie('jwt');
    console.log('logged out succesfully');
    res.redirect('http://localhost:3011');
  } catch (error) {
    console.log(error)
  }
  
});



module.exports = router;
