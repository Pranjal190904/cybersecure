const Complaint = require('../models/complaint.model');
const crypto = require('crypto');
const uploadOnCloudinary = require('../utils/cloudinary.util');
const sendBankMail = require('../utils/bankMail.util');

const complaintRegister = {
  incidentDetails : async (req, res) => {
    try {
      const { category , subcategory , date , time , delayReason , userBankName , utrNumber  } = req.body;      

      const acknowledgementNumber = crypto.randomBytes(8).toString("hex").toUpperCase();

      const complaintData = new Complaint({
        user : req.user.id ,
        acknowledgementNumber ,
        category ,
        subcategory ,
        date ,
        time ,
        delayReason ,
        userBankName ,
        utrNumber 
      });
      await complaintData.save();
      res.status(201).json({ message: "Complaint Registered successfully" , acknowledgementNumber : acknowledgementNumber});
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  complainantId : async (req, res) => {
    try {
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      const cloudinaryResponse = await uploadOnCloudinary(dataURI);   

      if (cloudinaryResponse.error || !cloudinaryResponse.secure_url) {
        return res
          .status(500)
          .json({ message: "Failed to upload image to Cloudinary" });
      }
      const { acknowledgementNumber } = req.query  ;    
      const complaint = await Complaint.findOneAndUpdate(
        {acknowledgementNumber : acknowledgementNumber},{nationalIdImageUrl : cloudinaryResponse.secure_url});
      
      if(!complaint){
        return res.status(404).json({message : "Complaint not found"}) ;
      }

      return res.status(200).json({message : "Complaint updated successfully"}) ;

    } catch (err) {
      console.log(err);
      return res.status(500).json({message : "Internal Server Error"}); 
    }
  },
  complainantDetails : async (req, res) => {
    try {
      const {acknowledgementNumber, name , gender, houseNo, country, streetName, state, district, nearestPoliceStation} = req.body ; 

      const compaint = await Complaint.findOneAndUpdate(
        { acknowledgementNumber: acknowledgementNumber },
        {name, gender, houseNo, country, streetName, state, district, nearestPoliceStation});

      if(!compaint){
        return res.status(404).json({message : "Complaint not found"}) ;
      }

      return res.status(200).json({message : "Complaint updated successfully"}) ;
    } catch (err) {
      consoel.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  importantDocuments : async (req, res) => {
    try {
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      const cloudinaryResponse = await uploadOnCloudinary(dataURI);   
      
      if (cloudinaryResponse.error || !cloudinaryResponse.secure_url) {
        return res
          .status(500)
          .json({ message: "Failed to upload image to Cloudinary" });
      }

      const { acknowledgementNumber } = req.query ;
      const complaint = await Complaint.findOneAndUpdate(
        { acknowledgementNumber: acknowledgementNumber },
        { $push: { importantDocumentsUrl: cloudinaryResponse.secure_url } }
      );

      if (!complaint) {
        return res.status(404).json({ message: "Complaint not found" });
      }
      return res.status(200).json({ message: "Complaint updated successfully" });
    } catch(err) {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  getActiveComplaints : async (req, res) => {
    try {
      
      const complaints = await Complaint.find({user : req.user.id , $or : [{actionTaken : "Pending"},{actionTaken : "Sent to Bank"}]}) ;
      if(!complaints){
        return res.status(404).json({message : "Complaints not found"}) ;
      }
      return res.status(200).json({complaints : complaints}) ;
    } catch(err) {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  getResolvedComplaints : async (req, res) => {
    try {
      const complaints = await Complaint.find({user : req.user.id , actionTaken : "Resolved"}) ;
      if(!complaints){
        return res.status(404).json({message : "Complaints not found"}) ;
      }
      return res.status(200).json({complaints : complaints}) ;
    } catch(err) {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  finalSubmit : async (req, res) => { 
    try {
      const { acknowledgementNumber } = req.body ;
      const complaint = await Complaint.findOne({acknowledgementNumber : acknowledgementNumber}).populate('user' , 'name email') ;
      sendBankMail("singh34rishi@gmail.com", acknowledgementNumber,  complaint.nationalIdImageUrl, complaint.importantDocumentsUrl);

      return res.status(200).json({message : "Complaint submitted successfully and sent to bank for verification"}) ;
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  getCases : async (req, res) => {
    try {
      const userId = req.user.id;
      const complaints = await Complaint.findOne({ user: userId });
      if (!complaints) {
        return res.status(404).json({ message: "Complaint not found" });
      }

      return res.status(200).json({ complaints: complaints });
    } catch (err) {
      console.log(err);
      res.status.json({ message: "Internal Server Error " });
    }
  }
}



module.exports = {complaintRegister};