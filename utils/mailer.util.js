const mailer = require("nodemailer");
const { EMAIL, PASS } = require("../config/env.config");


const sendOtpMail = async (email, otp) => {
  const transporter = mailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: EMAIL,
      pass: PASS,
    },
  });
  const mailOptions = {
    from: EMAIL,
    to: email,
    subject: "Email for OTP verification" ,
    html: `<p style="font-size: 16px;>Thank you for using our service. To verify your identity, we have sent you a 
       an OTP.
      </p>
      
      <p style="font-size: 16px;>If you did not request this , please ignore this email.
      </p>
      <p style="color : red">Your OTP is ${otp}</p>
      <p style="font-size: 16px;>Best regards,</p>
      <p style="font-size: 16px;>Cyber Secure</p> `,
  };
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      // console.log("Email Sent : " + info.response);
    }
  });
};

module.exports = { sendOtpMail };