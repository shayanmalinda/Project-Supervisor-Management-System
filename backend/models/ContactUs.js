const mongoose = require("mongoose");
const Schema = mongoose.schema;

var contactUsSchema = mongoose.Schema({
    firstName: { type: String },
    lastName: { type: String},
    contactNumber: { type: String },
    email:  {type: String},
    message : {type: String},
    
});

const ContactUs = (module.exports = mongoose.model("ContactUs", contactUsSchema));