const axios = require("axios");
const { NEWS_API_KEY } = require("../config/env.config");
const  Crime  = require("../models/cyberCrimeCategories.model"); 

const cyberCrimeInfo = {
  cyberTrends: async (req, res) => {
    try {
      const { query, page = 1, pageSize = 10 } = req.body; 

      const response = await axios.get(
        `https://newsapi.org/v2/everything?q=${query}&apiKey=${NEWS_API_KEY}&page=${page}&pageSize=${pageSize}`
      );


      const newsData = response.data;
      res.json(newsData);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  cyberCrimeCategories : async (req, res) => {
    try {
      const {category} = req.query ;
      console.log(category);

      const cyberCrimeCategory = await Crime.find({category:category});
      if(!cyberCrimeCategory){
        return res.status(404).json({message:"Category not found"}) ;
      }

      res.status(200).json({Crime:cyberCrimeCategory}) ;      

    } catch (err){
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};
module.exports = cyberCrimeInfo;