const mongoose = require("mongoose");
const adminSchema = new mongoose.Schema({
  name : {
    type : String ,
    required : true 
  }, 
  designation : {
    type : String ,
    required : true , 
  }, 
  email : {
    type : String ,
    required : true 
  },
  identificationNumber : {
    type : String ,
    required : true 
  },
  issuedDate : {
    type : Date ,
    default : Date.now
  }
});

module.exports = mongoose.model("Admin", adminSchema);