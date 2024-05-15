const Admin = require("../models/admin.model");
const Complaint = require("../models/complaint.model");
const Otp = require("../models/otp.model");
const { sendOtpMail } = require("../utils/mailer.util");
const Token = require("../middlewares/token.middleware");

const admin = {
  login: async (req, res) => {
    try {
      const { name, designation, identificationNumber, issuedDate } = req.body;
      
      const admin = await Admin.findOne({ identificationNumber });

      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      if (name != admin.name || designation != admin.designation) {
        return res.status(400).json({ message: "Invalid Credentials" });
      }

      const email = admin.email;

      const existingOtp = await Otp.findOne({ email });
      if (existingOtp) {
        await existingOtp.deleteOne({ email });
      }

      const otp = Math.floor(1000 + Math.random() * 9000);
      const OTP = new Otp({
        email,
        otp,
      });

      await OTP.save();

      sendOtpMail(email, otp);

      res
        .status(200)
        .json({ message: "Otp Sent successfully", email: admin.email });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  verifyOtp: async (req, res) => {
    try {
      const { email, otp } = req.body;

      const OTP = await Otp.findOne({ email });
      if (!OTP) {
        return res.status(404).json({ message: "User not found" });
      }
      if (OTP.otp != otp) {
        return res.status(400).json({ message: "OTP is incorrect" });
      }
      const admin = await Admin.findOne({ email });
      const token = await Token.signAccessToken(admin.id);

      await OTP.deleteOne({ email });

      const isLocalhost = req.headers.origin === "http://localhost:5173";
      // const sameSiteSetting = isLocalhost ? "Lax" : "None";

      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 * 7,
        secure: true,
      });

      return res.status(200).json({
        message: "User verified successfully",
        admin: admin,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  getComplaints: async (req, res) => {
    try {
      const complaints = await Complaint.find({}).populate(
        "user",
        "name email"
      );

      if (!complaints) {
        return res.status(404).json({ message: "Complaints not found" });
      }

      return res.status(200).json({ complaints: complaints });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  verifyComplaint: async (req, res) => {
    try {
      const {
        acknowledgementNumber,
        verificationStatus,
        dismissalStatus,
        dismissalReason,
        actionTaken,
        bankName,
        holderName,
        accountNumber,
        branch,
        freezeReason,
      } = req.body;

      const adminId = req.adminId;

      const admin = await Admin.findById(adminId);
      const complaint = await Complaint.findOne({ acknowledgementNumber });

      await Complaint.findByIdAndUpdate(
        complaint.id,
        {
          verificationStatus,
          dismissalStatus,
          dismissalReason,
          actionTaken,
          "bankDetails.bankName": bankName,
          "bankDetails.holderName": holderName,
          "bankDetails.accountNumber": accountNumber,
          "bankDetails.branch": branch,
          "bankDetails.freezeReason": freezeReason,
          verifyingOfficer: admin.name,
        },
        { new: true }
      );

      return res
        .status(200)
        .json({ message: "Police Verification process Completed" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};

module.exports = admin;