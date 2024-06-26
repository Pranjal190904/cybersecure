const {ACCESS_TOKEN_SECRET} = require('../config/env.config');
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const Token = {
  signAccessToken: (id) => {
    return new Promise((resolve, reject) => {
      const payload = {
        aud:id
      };
      const secret = ACCESS_TOKEN_SECRET;
      const options = {
        expiresIn: "10d",
        issuer: "CyberSecure",
      };
      jwt.sign(payload, secret, options, (err, token) => {
        if (err) reject(err);
        resolve(token);
      });
    });
  },
  verifyAccessToken: async (req, res, next) => {
    try {
      
      const token = req.header("Authorization");
      if (!token) {
        return res
          .status(401)
          .json({ message: "Unauthorized - Missing token" });
      }
      const Token=token.split(" ")[1];
      const decoded = jwt.verify(Token, ACCESS_TOKEN_SECRET);

      req.user = await User.findById(decoded.aud).select("-passwd");
      

      next();
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};

module.exports = Token;