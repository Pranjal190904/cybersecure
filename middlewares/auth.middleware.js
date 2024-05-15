const jwt = require("jsonwebtoken");
const {ACCESS_TOKEN_SECRET} = require('../config/env.config') ;

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded =jwt.verify(token, ACCESS_TOKEN_SECRET);
    
    req.adminId = decoded.aud;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = auth;
