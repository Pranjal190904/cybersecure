const User = require('../models/user.model');
const Otp = require('../models/otp.model');
const { sendOtpMail } = require('../utils/mailer.util');
const Token = require('../middlewares/token.middleware');

const auth_controller = {
  register: async (req, res) => {
    try {
      const { email , name } = req.body;
      const otp = Math.floor(1000 + Math.random() * 9000);

      const existingUser = await User.findOne({ email }); 
      if(!existingUser) {
        const user = new User({
          name,
          email,
        });
        await user.save();
      }      
      const existingOtp = await Otp.findOne({ email });
      if(existingOtp){
        await existingOtp.deleteOne({ email });
      }

      const OTP = new Otp({
        email ,
        otp
      });

      await OTP.save(); 

      sendOtpMail(email, otp);

      res.status(201).json({ message: "Otp Sent successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  verify_otp : async (req, res) => {
    try {
      const { email , otp  } = req.body;
      
      const OTP = await Otp.findOne({ email }); 
      if(!OTP) {
        return res.status(404).json({ message : 'User not found' });
      } 
      if (OTP.otp != otp) {
        return res.status(400).json({ message : 'OTP is incorrect' });
      } 
      const user = await User.findOne({ email });
      const accessToken = await Token.signAccessToken(user.id);

      await OTP.deleteOne({ email });

      res.cookie('accessToken', accessToken , { 
        httpOnly : true , 
        secure : true , 
        sameSite : 'none'
      } ) 

      return res.status(200).json({ message : 'User verified successfully' });

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}; 

module.exports = auth_controller;