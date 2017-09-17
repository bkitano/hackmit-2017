// CONSTANTS
var assert = require("assert");
var express = require('express');
var exphbs  = require('express-handlebars');
var mongoose = require('mongoose');
var passport = require('passport');
var fbAuth = require('./authentication.js');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

// MODELS
var User = require('./models/user.js');
var Internship = require('./models/internship.js');
var Company = require("./models/company.js");
var Application = require("./models/application.js");

// FUNCTIONS
// guid generator
function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

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
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

passport.serializeUser(function(user, done) {
  console.log('serializeUser: ' + user._id);
  done(null, user._id);
});
passport.deserializeUser(function(id, done) {
   User.findById(id, function(err, user) {
     done(err, user);
   });
})
app.get('/auth/facebook',
  passport.authenticate('facebook',{authType: 'reauthenticate'}),
  function(req, res){});
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
  });
  
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}

// ROUTES
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/login');
});


app.get('/', function (req, res) {
  // what goes on the home page?
  // all of the apps in your dashboard.
  if(req.userID) {
    Application.find({oauthID: req.user.oauthID}, function(err, apps) {
    if(err) {
      console.log(err);
    } else {
        res.render('dashboard', {oauthID: req.user.oauthID, apps: apps});
      }
    });
  } else {
    res.render('landing');
  }
});

app.get('/login', function (req, res) {
  console.log("heading to login page...");
  res.render('login', { user: req.user.oauthID});
});

app.get('/add', ensureAuthenticated, function(req, res) {
  res.render('add', {user: req.user.oauthID});
})

// adding a job to the account
app.post('/add/submit', function(req, res) {
  
  var today = new Date();
  // creating a document from the Internship model
  var req_data = {
    internshipID: guid(),
    company: req.body.company,
    position: req.body.position,
    url: req.body.url,
    deadline: req.body.deadline
  }
  
  var internship = new Internship(req_data);
  
  // save the internship to the site
  internship.save();
  
  // now take the 
  
  var application = new Application({
    applicationID: guid(),
    oauthID: req.user.oauthID,
    user: req.session.passport.user,
    contact: req.body.contact,
    internship: req_data.internshipID,
    progress: req.body.progress,
    created: today
  })
  
  application.save();
  
  res.redirect('/');
})

// add an application for a person
app.post("/save", function(req, res) {
  // create a new application document from the Model
  var today = new Date();
  
  var application = new Application({
    userID: req.user.oauthID,
    contact: req.body.contact,
    internship: req.body.internshipID,
    progress: req.body.progress,
    created: today
  })
  
  application.save();
});


// FOOTERS
app.listen(process.env.PORT || 8080, function () {
  console.log('Example app listening on port 8080!');
});