// CONSTANTS

var express = require('express');
var exphbs  = require('express-handlebars');
const app = express()

// MIDDLEWARE
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


// ROUTES
app.get('/', function (req, res) {
  res.send('Hello World!')
})


// FOOTERS
app.listen(8080, function () {
  console.log('Example app listening on port 8080!')
})