const mongoose = require('mongoose');

const cyberCrimeCategoriesSchema = new mongoose.Schema({
  category : {
    type : String ,
    required : true ,
  },
  description : {
    type : String ,
    required : true 
  },
  youtubeVideoUrl : {
    type : String ,
  },
  protection : {
    type : String ,     
  }
});

module.exports = mongoose.model('CyberCrimeCategories', cyberCrimeCategoriesSchema) ;