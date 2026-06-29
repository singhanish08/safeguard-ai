const express = require('express');
const router = express.Router();
const { getMonthlyReport, getDepartmentReport, getHighRiskReport } = require('../controllers/reportController');
const protect = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

router.get('/monthly', protect, authorize('manager', 'admin'), getMonthlyReport);
router.get('/department', protect, authorize('manager', 'admin'), getDepartmentReport);
router.get('/high-risk', protect, authorize('manager', 'admin'), getHighRiskReport);

module.exports = router;
