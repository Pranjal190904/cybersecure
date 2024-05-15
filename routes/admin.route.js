const router = require('express').Router();
const admin = require('../controllers/admin.controller');
const auth = require('../middlewares/auth.middleware');

router.post('/login', admin.login); 
router.post('/verifyOtp', admin.verifyOtp);
router.get('/getComplaints', auth , admin.getComplaints)
router.post('/verifyComplaint', auth , admin.verifyComplaint); 

module.exports = router;