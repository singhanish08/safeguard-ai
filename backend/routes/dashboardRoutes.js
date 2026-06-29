const express = require('express');
const router = express.Router();
const {
  getEmployeeDashboard,
  getManagerDashboard,
  getAdminDashboard,
} = require('../controllers/dashboardController');
const protect = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

router.get('/employee', protect, authorize('employee'), getEmployeeDashboard);
router.get('/manager', protect, authorize('manager'), getManagerDashboard);
router.get('/admin', protect, authorize('admin'), getAdminDashboard);

module.exports = router;
