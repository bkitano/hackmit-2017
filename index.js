// CONSTANTS
var assert = require("assert");
var express = require('express');
var exphbs  = require('express-handlebars');
var mongoose = require('mongoose');
var passport = require('passport');
var fbAuth = require('./authentication.js');
var User = require('./user.js');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

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
mongoose.connect(mongourl, function(error) {
    assert.equal(null,error);
    console.log("Connected successfully to database");
    // mongoose.connection.close();
});

// passport

app.use(session({ secret: 'my_precious' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(bodyParser());

passport.serializeUser(function(user, done) {
  console.log('serializeUser: ' + user._id);
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
   User.findById(id, function(err, user) {
     done(err, user);
   });
})

// passport routes

// app.get('/account', ensureAuthenticated, function(req, res){
//   User.findById(req.session.passport.user, function(err, user) {
//     if(err) {
//       console.log(err);  // handle errors
//     } else {
//       res.render('account', { user: user});
//     }
//   });
// });


app.get('/account', ensureAuthenticated, function(req, res){
  User.findById(req.session.passport.user, function(err, user) {
    if(err) {
      console.log(err);  // handle errors
    } else {
      res.render('account', { user: user});
    }
  });
});
app.get('/react1', function(req, res) {
  res.render('react1');
})

app.get('/auth/facebook',
  passport.authenticate('facebook',{authType: 'reauthenticate'}),
  function(req, res){});
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/account');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/');
}

// ROUTES
app.get('/', function (req, res) {
  console.log("heading to login page...");
  res.render('login');
});


// FOOTERS
app.listen(process.env.PORT || 8080, function () {
  console.log('Example app listening on port 8080!');
});