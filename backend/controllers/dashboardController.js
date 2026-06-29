const Incident = require('../models/Incident');
const User = require('../models/User');
const Department = require('../models/Department');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const safetyTips = [
  'Always wear appropriate PPE for your work area. It takes just a second to put on safety glasses.',
  'Report all near misses — they are free lessons that prevent future accidents.',
  'Never bypass safety interlocks. They are there to protect you.',
  'Keep work areas clean and free of clutter to prevent trips and falls.',
  'Follow lockout/tagout procedures before servicing any equipment.',
  'Know the location of emergency exits, eyewash stations, and fire extinguishers.',
  'Never lift beyond your capacity — use mechanical aids for heavy loads.',
  'Chemical containers must always be properly labeled and stored.',
  'Take regular breaks to maintain focus — fatigue causes accidents.',
  'When in doubt about safety procedures, stop and ask your supervisor.',
];

const getEmployeeDashboard = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const [totalIncidents, openIncidents, resolvedIncidents, highRiskIncidents, recentIncidents] = await Promise.all([
    Incident.countDocuments({ reporter: userId }),
    Incident.countDocuments({ reporter: userId, status: { $in: ['Open', 'Under Investigation'] } }),
    Incident.countDocuments({ reporter: userId, status: 'Resolved' }),
    Incident.countDocuments({ reporter: userId, 'aiAnalysis.riskScore': { $gte: 70 } }),
    Incident.find({ reporter: userId })
      .populate('department', 'name')
      .sort({ createdAt: -1 })
      .limit(5),
  ]);

  const tipOfDay = safetyTips[new Date().getDate() % safetyTips.length];

  res.status(200).json(
    new ApiResponse(200, {
      totalIncidents,
      openIncidents,
      resolvedIncidents,
      highRiskIncidents,
      recentIncidents,
      safetyTip: tipOfDay,
    })
  );
});

const getManagerDashboard = asyncHandler(async (req, res) => {
  const now = new Date();
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [totalIncidents, openIncidents, highRiskIncidents, resolvedThisMonth, incidents] = await Promise.all([
    Incident.countDocuments(),
    Incident.countDocuments({ status: { $in: ['Open', 'Under Investigation'] } }),
    Incident.countDocuments({ 'aiAnalysis.riskScore': { $gte: 70 } }),
    Incident.countDocuments({ status: 'Resolved', updatedAt: { $gte: firstOfMonth } }),
    Incident.find()
      .populate('department', 'name')
      .sort({ createdAt: -1 }),
  ]);

  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  const monthlyData = await Incident.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const severityData = await Incident.aggregate([
    {
      $group: {
        _id: '$aiAnalysis.severityLevel',
        count: { $sum: 1 },
      },
    },
  ]);

  const departmentData = await Incident.aggregate([
    { $group: { _id: '$department', count: { $sum: 1 } } },
    { $lookup: { from: 'departments', localField: '_id', foreignField: '_id', as: 'department' } },
    { $unwind: { path: '$department', preserveNullAndEmptyArrays: true } },
    { $project: { _id: { $ifNull: ['$department.name', 'Unknown'] }, count: 1 } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);

  const statusData = await Incident.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const highRiskAlerts = await Incident.find({ 'aiAnalysis.riskScore': { $gte: 80 } })
    .populate('reporter', 'name')
    .populate('department', 'name')
    .sort({ 'aiAnalysis.riskScore': -1 })
    .limit(5);

  const recentIncidents = await Incident.find()
    .populate('reporter', 'name')
    .populate('department', 'name')
    .populate('assignedTo', 'name')
    .sort({ createdAt: -1 })
    .limit(10);

  res.status(200).json(
    new ApiResponse(200, {
      totalIncidents,
      openIncidents,
      highRiskIncidents,
      resolvedThisMonth,
      monthlyTrend: monthlyData,
      severityDistribution: severityData,
      departmentWise: departmentData,
      statusDistribution: statusData,
      recentIncidents,
      highRiskAlerts,
    })
  );
});

const getAdminDashboard = asyncHandler(async (req, res) => {
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const [totalUsers, totalEmployees, totalManagers, totalDepartments, totalIncidents, highSeverityIncidents, departmentData, statusData, recentUsers, recentIncidents] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: 'employee' }),
    User.countDocuments({ role: 'manager' }),
    Department.countDocuments(),
    Incident.countDocuments(),
    Incident.countDocuments({ 'aiAnalysis.severityLevel': { $in: ['High', 'Critical'] } }),
    Incident.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $lookup: { from: 'departments', localField: '_id', foreignField: '_id', as: 'department' } },
      { $unwind: { path: '$department', preserveNullAndEmptyArrays: true } },
      { $project: { _id: { $ifNull: ['$department.name', 'Unknown'] }, count: 1 } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]),
    Incident.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    User.find().populate('department', 'name').sort({ createdAt: -1 }).limit(5),
    Incident.find()
      .populate('reporter', 'name')
      .populate('department', 'name')
      .sort({ createdAt: -1 })
      .limit(5),
  ]);

  const userGrowth = await User.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo } } },
    { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);

  const monthlyTrend = await Incident.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo } } },
    { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);

  res.status(200).json(
    new ApiResponse(200, {
      totalUsers,
      totalEmployees,
      totalManagers,
      totalDepartments,
      totalIncidents,
      highSeverityIncidents,
      departmentWise: departmentData,
      userGrowth,
      statusDistribution: statusData,
      monthlyTrend,
      recentUsers,
      recentIncidents,
    })
  );
});

module.exports = { getEmployeeDashboard, getManagerDashboard, getAdminDashboard };
