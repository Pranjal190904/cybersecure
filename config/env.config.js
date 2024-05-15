require('dotenv').config() ;

module.exports = {
  PORT: process.env.PORT || 3000,
  DB_URI: process.env.DB_URI || "mongodb://localhost:27017/cybercrime",
  EMAIL : process.env.EMAIL,
  PASS : process.env.PASS,
  ACCESS_TOKEN_SECRET : process.env.ACCESS_TOKEN_SECRET,
  CLOUD_API_SECRET : process.env.CLOUD_API_SECRET,
  CLOUD_NAME : process.env.CLOUD_NAME,
  CLOUD_API_KEY : process.env.CLOUD_API_KEY,
  NEWS_API_KEY: process.env.NEWS_API_KEY
};

