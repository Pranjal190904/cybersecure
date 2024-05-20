const Complaint = require('../models/complaint.model');

const bankController = {
  freeze: async (req, res) => {
    try {
      const { acknowledgementNumber } = req.query;
      const complaint = await Complaint.findOneAndUpdate({ acknowledgementNumber },{progress:5});
      return res.send("<center><h1>Account Freezed</h1></center>");
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  denyComplaint: async (req, res) => {
    try {
      const { acknowledgementNumber } = req.query;
      const complaint = await Complaint.findOne({ acknowledgementNumber },{isComplaintRejected:true,dismissalStatus:true});
      return res.send("<center><h1>Complaint Denied</h1></center>");

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};
module.exports = bankController;