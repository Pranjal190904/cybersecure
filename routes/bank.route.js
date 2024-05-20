const router = require('express').Router();
const bankController = require('../controllers/bank.controller');

router.get('/freeze', bankController.freeze);
router.get('/deny', bankController.denyComplaint);

module.exports = router ;