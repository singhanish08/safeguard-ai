const { body } = require('express-validator');

const createIncidentValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description')
    .trim()
    .isLength({ min: 20 })
    .withMessage('Description must be at least 20 characters'),
  body('department').isMongoId().withMessage('Valid department is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('incidentDate').isISO8601().withMessage('Valid incident date is required'),
  body('incidentTime').notEmpty().withMessage('Incident time is required'),
  body('category')
    .isIn([
      'Chemical Leak', 'Fire Hazard', 'Equipment Failure', 'Electrical Hazard',
      'Gas Leak', 'Near Miss', 'Unsafe Condition', 'PPE Violation', 'Oil Spill', 'Other',
    ])
    .withMessage('Invalid category'),
  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High', 'Critical'])
    .withMessage('Invalid priority'),
];

const updateStatusValidation = [
  body('status')
    .isIn(['Open', 'Under Investigation', 'Assigned', 'Resolved', 'Closed'])
    .withMessage('Invalid status'),
];

module.exports = { createIncidentValidation, updateStatusValidation };
