var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// the instructions
var applicationSchema = new Schema({
    applicationID: String,
    oauthID: Number,
    internshipID: String,
    contact: String,
    progress: String,
    created: Date
})

// methods for the model

// set status
applicationSchema.methods.setStatus = function(status) {
    this.status = status;
}

var Application = mongoose.model('Application', applicationSchema);

module.exports = Application;