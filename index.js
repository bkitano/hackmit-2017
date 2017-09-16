// CONSTANTS
var assert = require("assert");
var express = require('express');
var exphbs  = require('express-handlebars');
var MongoClient = require("mongodb").MongoClient;

var passport = require('passport');
var config = require('./oauth.js');
var FacebookStrategy = require('passport-facebook').Strategy;


// MIDDLEWARE

// express
const app = express()
app.engine('handlebars', exphbs({defaultLayout: 'main'}));

// handlebars
app.set('view engine', 'handlebars');
app.use('/assets', express.static(__dirname + '/assets'));

// mongo
var mongourl = "mongodb://matteo:1234@ds139124.mlab.com:39124/hackmit-2017"

// check to make sure the database is connected at the start
MongoClient.connect(mongourl, function(err, db) {
  assert.equal(null, err);
  console.log("Connected successfully to database");
  db.close();
});

// ROUTES
app.get('/', function (req, res) {
  res.send('Hello World!')
})


// FOOTERS
app.listen(8080, function () {
  console.log('Example app listening on port 8080!')
})