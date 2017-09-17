var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a Company model to hold a company's characteristics
var companySchema = new Schema({
  companyID: String,
  name: String,
  location: String,
  glassdoorID: Number,
  industry: String,
  internships: [{internshipID: String}]
});

var Company = mongoose.model('Company', companySchema);


module.exports = Company;