require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var userapiRouter = require('./routes/user');
var recipeapiRouter = require('./routes/recipe');
var profilerouter=require('./routes/profile')
var homerouter=require('./routes/home')


var app = express();
// Set up mongoose connection
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const mongoDB = process.env.MONGO_URL;

mongoose.connect(mongoDB).then(()=>{console.log("db connected")}).catch((error)=>{console.log('no connection');});
app.use(bodyParser.json());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/userapi',userapiRouter);
app.use('/recipeapi',recipeapiRouter);
app.use('/home',homerouter);
app.use('/home/profile',profilerouter);



app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
