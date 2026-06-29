const express = require('express');
const router = express.Router();
const {
  createIncident,
  getAllIncidents,
  getMyIncidents,
  getIncidentById,
  updateStatus,
  updateRemarks,
  assignIncident,
  deleteIncident,
} = require('../controllers/incidentController');
const protect = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { createIncidentValidation, updateStatusValidation } = require('../validators/incidentValidator');

router.post('/', protect, authorize('employee'), upload.array('images', 5), createIncidentValidation, createIncident);
router.get('/', protect, authorize('manager', 'admin'), getAllIncidents);
router.get('/my', protect, authorize('employee'), getMyIncidents);
router.get('/:id', protect, getIncidentById);
router.put('/:id/status', protect, authorize('manager', 'admin'), updateStatusValidation, updateStatus);
router.put('/:id/remarks', protect, authorize('manager', 'admin'), updateRemarks);
router.put('/:id/assign', protect, authorize('manager', 'admin'), assignIncident);
router.delete('/:id', protect, authorize('admin'), deleteIncident);

module.exports = router;
