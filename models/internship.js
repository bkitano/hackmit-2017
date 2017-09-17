var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a job model to hold our internship data
var internshipSchema = new Schema({
  internshipID: String,
  companyID: String,
  company: String,
  position: String,
//   isPaid: Boolean,
//   isAccomodation: Boolean,
//   locationDesc: String,
  deadline: Date,
  url: String
});

internshipSchema.methods.overdue = function(date) {
  var now = Date();
  if (this.deadline.now - now > 0) {
    return false;
  } else {
    return true;
  }
}

var Internship = mongoose.model('Internship', internshipSchema);

module.exports = Internship;