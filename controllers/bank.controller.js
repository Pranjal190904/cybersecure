const Complaint = require('../models/complaint.model');

const bankController = {
  freeze: async (req, res) => {
    try {
      const { acknowledgementNumber } = req.query;
      const complaint = await Complaint.findOne({ acknowledgementNumber });

      if (complaint.verificationStatus) {
        return res.send("<center><h1>Account already Freezed</h1></center>");
      }
      if(complaint.dismissalStatus){
        return res.send("<center><h1>Complaint Already Denied </h1></center>");
      }
      await complaint.updateOne({ verificationStatus: true });
      return res.send("<center><h1>Account Freezed</h1></center>");
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  denyComplaint: async (req, res) => {
    try {
      const { acknowledgementNumber } = req.query;
      const complaint = await Complaint.findOne({ acknowledgementNumber });

      if(complaint.verificationStatus){
        return res.send("<center><h1>Account already Freezed</h1></center>");
      }
      if (complaint.dismissalStatus) {
        return res.send("<center><h1>Complaint Already Denied </h1></center>");
      }


      await complaint.updateOne({ dismissalStatus: true }); 
      return res.send("<center><h1>Complaint Denied</h1></center>");

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};
module.exports = bankController;