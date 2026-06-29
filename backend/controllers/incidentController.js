const { validationResult } = require('express-validator');
const Incident = require('../models/Incident');
const Notification = require('../models/Notification');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { analyzeIncident } = require('../services/geminiService');
const { uploadToCloudinary } = require('../services/cloudinaryService');

const createIncident = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(400, 'Validation failed', errors.array().map((e) => e.msg));
  }

  const { title, description, department, location, incidentDate, incidentTime, category, priority } = req.body;

  let imageUrls = [];
  if (req.files && req.files.length > 0) {
    const uploadPromises = req.files.map((file) => uploadToCloudinary(file.buffer));
    const results = await Promise.all(uploadPromises);
    imageUrls = results.filter(Boolean);
  }

  const departmentName = req.body.departmentName || '';

  const incident = await Incident.create({
    title,
    description,
    department,
    location,
    incidentDate,
    incidentTime,
    category,
    priority: priority || 'Medium',
    reporter: req.user._id,
    images: imageUrls,
    statusHistory: [
      {
        status: 'Open',
        changedBy: req.user._id,
        changedAt: new Date(),
        note: 'Incident reported',
      },
    ],
  });

  const analysis = await analyzeIncident({
    title,
    description,
    category,
    location,
    department: departmentName,
    incidentDate,
    priority: priority || 'Medium',
  });

  incident.aiAnalysis = analysis;
  await incident.save();

  const populated = await Incident.findById(incident._id)
    .populate('reporter', 'name email avatar')
    .populate('department', 'name')
    .populate('assignedTo', 'name email avatar');

  const managers = await require('../models/User').find({
    role: { $in: ['manager', 'admin'] },
    isActive: true,
  });

  const notifications = managers.map((m) => ({
    user: m._id,
    title: 'New Incident Reported',
    message: `${req.user.name} reported a new ${category} incident: ${title}`,
    type: 'new_incident',
    incidentId: incident._id,
  }));

  if (notifications.length > 0) {
    await Notification.insertMany(notifications);
  }

  res.status(201).json(new ApiResponse(201, populated, 'Incident reported and analyzed by AI'));
});

const getAllIncidents = asyncHandler(async (req, res) => {
  const { status, severity, department, dateFrom, dateTo, keyword, priority, page = 1, limit = 10 } = req.query;

  const filter = {};

  if (status) filter.status = status;
  if (severity) filter['aiAnalysis.severityLevel'] = severity;
  if (department) filter.department = department;
  if (priority) filter.priority = priority;
  if (dateFrom || dateTo) {
    filter.incidentDate = {};
    if (dateFrom) filter.incidentDate.$gte = new Date(dateFrom);
    if (dateTo) filter.incidentDate.$lte = new Date(dateTo);
  }
  if (keyword) {
    filter.$or = [
      { title: { $regex: keyword, $options: 'i' } },
      { description: { $regex: keyword, $options: 'i' } },
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [incidents, total] = await Promise.all([
    Incident.find(filter)
      .populate('reporter', 'name email avatar')
      .populate('department', 'name')
      .populate('assignedTo', 'name email avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    Incident.countDocuments(filter),
  ]);

  res.status(200).json(
    new ApiResponse(200, {
      incidents,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    })
  );
});

const getMyIncidents = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [incidents, total] = await Promise.all([
    Incident.find({ reporter: req.user._id })
      .populate('department', 'name')
      .populate('assignedTo', 'name email avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    Incident.countDocuments({ reporter: req.user._id }),
  ]);

  res.status(200).json(
    new ApiResponse(200, {
      incidents,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    })
  );
});

const getIncidentById = asyncHandler(async (req, res) => {
  const incident = await Incident.findById(req.params.id)
    .populate('reporter', 'name email avatar department')
    .populate('department', 'name')
    .populate('assignedTo', 'name email avatar')
    .populate('statusHistory.changedBy', 'name');

  if (!incident) {
    throw new ApiError(404, 'Incident not found');
  }

  if (req.user.role === 'employee' && incident.reporter._id.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Not authorized to view this incident');
  }

  res.status(200).json(new ApiResponse(200, incident));
});

const updateStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;
  const incident = await Incident.findById(req.params.id);

  if (!incident) {
    throw new ApiError(404, 'Incident not found');
  }

  const validTransitions = {
    'Open': ['Under Investigation', 'Assigned', 'Closed'],
    'Under Investigation': ['Assigned', 'Resolved', 'Closed'],
    'Assigned': ['Under Investigation', 'Resolved', 'Closed'],
    'Resolved': ['Closed'],
    'Closed': [],
  };

  if (!validTransitions[incident.status].includes(status)) {
    throw new ApiError(400, `Cannot transition from ${incident.status} to ${status}`);
  }

  incident.status = status;
  incident.statusHistory.push({
    status,
    changedBy: req.user._id,
    changedAt: new Date(),
    note: note || '',
  });

  await incident.save();

  await Notification.create({
    user: incident.reporter,
    title: 'Incident Status Updated',
    message: `Your incident "${incident.title}" has been updated to ${status}`,
    type: 'status_change',
    incidentId: incident._id,
  });

  const populated = await Incident.findById(incident._id)
    .populate('reporter', 'name email avatar')
    .populate('department', 'name')
    .populate('assignedTo', 'name email avatar')
    .populate('statusHistory.changedBy', 'name');

  res.status(200).json(new ApiResponse(200, populated, 'Status updated'));
});

const updateRemarks = asyncHandler(async (req, res) => {
  const { remarks } = req.body;
  const incident = await Incident.findById(req.params.id);

  if (!incident) {
    throw new ApiError(404, 'Incident not found');
  }

  incident.managerRemarks = remarks;
  await incident.save();

  await Notification.create({
    user: incident.reporter,
    title: 'Manager Remarks Added',
    message: `Manager added remarks to your incident "${incident.title}"`,
    type: 'remark_added',
    incidentId: incident._id,
  });

  const populated = await Incident.findById(incident._id)
    .populate('reporter', 'name email avatar')
    .populate('department', 'name')
    .populate('assignedTo', 'name email avatar');

  res.status(200).json(new ApiResponse(200, populated, 'Remarks updated'));
});

const assignIncident = asyncHandler(async (req, res) => {
  const { assignedTo } = req.body;
  const incident = await Incident.findById(req.params.id);

  if (!incident) {
    throw new ApiError(404, 'Incident not found');
  }

  incident.assignedTo = assignedTo;
  await incident.save();

  const populated = await Incident.findById(incident._id)
    .populate('reporter', 'name email avatar')
    .populate('department', 'name')
    .populate('assignedTo', 'name email avatar');

  res.status(200).json(new ApiResponse(200, populated, 'Incident assigned'));
});

const deleteIncident = asyncHandler(async (req, res) => {
  const incident = await Incident.findById(req.params.id);
  if (!incident) {
    throw new ApiError(404, 'Incident not found');
  }
  await incident.deleteOne();
  res.status(200).json(new ApiResponse(200, null, 'Incident deleted'));
});

module.exports = {
  createIncident,
  getAllIncidents,
  getMyIncidents,
  getIncidentById,
  updateStatus,
  updateRemarks,
  assignIncident,
  deleteIncident,
};
