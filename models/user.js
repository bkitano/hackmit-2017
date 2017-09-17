var mongoose = require('mongoose');
var autopopulate = require('mongoose-autopopulate')
var Schema = mongoose.Schema;

var Application = require("./application.js");

var userSchema = new Schema({
  oauthID: Number,
  name: String,
  created: Date
})

// User methods
userSchema.methods.getApps = function() {
  Application.find({'userID':this.oauthID}, function(err, apps) {
    if(err) {
      console.log(err);
    } else {
      return apps;
    }
  });
}


// create a user model
var User = mongoose.model('User', userSchema);


module.exports = User;
