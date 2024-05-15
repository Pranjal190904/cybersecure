const mongoose = require('mongoose');
const otpSchema = new mongoose.Schema({
  number : {
    type : Number ,
    // required : true ,
  } , 
  email : {
    type : String ,
    required : true ,
  }, 
  otp : {
    type : Number ,
    required : true ,
  } ,
  createdAt : {
    type : Date ,
    default : Date.now ,
    expires : 3000 ,
  }
}); 

module.exports = mongoose.model('otp', otpSchema) ;