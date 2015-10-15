var express = require('express');
var app = express();

var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var session = require('express-session');
var methodOverride = require('method-override');
var config = require('./config');
var router = require('../app/routes/router');



mongoose.connect(config.db);


//parse body contents as a JSON objects
app.use(bodyParser.json());

app.use(morgan('dev'));

app.use(session({
  saveUninitialized: false,
  secret: config.key,
  resave: false
}));

app.use(bodyParser.json({
  type: 'application/vnd.api+json'
}));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: true
}));

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override'));

app.use(cookieParser());

app.use('/', router);

exports = module.exports = app;
