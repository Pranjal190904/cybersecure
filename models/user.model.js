const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  number : {
    type : Number ,
    // required : true ,
  } , 
  email : {
    type : String ,
    required : true ,
  }, 
  name : {
    type : String ,
    required : true ,
  } ,
  createdAt : {
    type : Date ,
    default : Date.now ,
  }
})

module.exports = mongoose.model('User', userSchema) ;