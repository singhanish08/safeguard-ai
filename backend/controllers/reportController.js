const Incident = require('../models/Incident');
const Department = require('../models/Department');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const getMonthlyReport = asyncHandler(async (req, res) => {
  const { month, year } = req.query;
  const targetMonth = parseInt(month) || (new Date().getMonth() + 1);
  const targetYear = parseInt(year) || new Date().getFullYear();

  const startDate = new Date(targetYear, targetMonth - 1, 1);
  const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59);

  const incidents = await Incident.find({
    createdAt: { $gte: startDate, $lte: endDate },
  })
    .populate('reporter', 'name')
    .populate('department', 'name')
    .sort({ createdAt: -1 });

  const total = incidents.length;
  const byStatus = {};
  const bySeverity = {};
  const byCategory = {};
  let highRiskCount = 0;

  incidents.forEach((inc) => {
    byStatus[inc.status] = (byStatus[inc.status] || 0) + 1;
    bySeverity[inc.aiAnalysis?.severityLevel || 'Unknown'] = (bySeverity[inc.aiAnalysis?.severityLevel || 'Unknown'] || 0) + 1;
    byCategory[inc.category] = (byCategory[inc.category] || 0) + 1;
    if ((inc.aiAnalysis?.riskScore || 0) >= 70) highRiskCount++;
  });

  const dailyCounts = {};
  incidents.forEach((inc) => {
    const day = new Date(inc.createdAt).getDate();
    dailyCounts[day] = (dailyCounts[day] || 0) + 1;
  });

  const chartData = Object.entries(dailyCounts)
    .map(([day, count]) => ({ day: parseInt(day), count }))
    .sort((a, b) => a.day - b.day);

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  res.status(200).json(
    new ApiResponse(200, {
      summary: {
        total,
        highRiskCount,
        byStatus,
        bySeverity,
        byCategory,
        month: monthNames[targetMonth - 1],
        year: targetYear,
      },
      chartData,
      incidents,
    })
  );
});

const getDepartmentReport = asyncHandler(async (req, res) => {
  const { departmentId } = req.query;

  if (!departmentId) {
    const departments = await Department.find().populate('head', 'name');

    const report = await Promise.all(
      departments.map(async (dept) => {
        const count = await Incident.countDocuments({ department: dept._id });
        const openCount = await Incident.countDocuments({ department: dept._id, status: { $ne: 'Closed' } });
        return {
          department: dept,
          totalIncidents: count,
          openIncidents: openCount,
        };
      })
    );

    return res.status(200).json(new ApiResponse(200, report));
  }

  const department = await Department.findById(departmentId).populate('head', 'name email');
  if (!department) {
    return res.status(404).json({ success: false, message: 'Department not found' });
  }

  const incidents = await Incident.find({ department: departmentId })
    .populate('reporter', 'name')
    .populate('assignedTo', 'name')
    .sort({ createdAt: -1 });

  const total = incidents.length;
  const openIncidents = incidents.filter((i) => i.status !== 'Closed').length;
  const bySeverity = {};
  let highRiskCount = 0;

  incidents.forEach((inc) => {
    bySeverity[inc.aiAnalysis?.severityLevel || 'Unknown'] = (bySeverity[inc.aiAnalysis?.severityLevel || 'Unknown'] || 0) + 1;
    if ((inc.aiAnalysis?.riskScore || 0) >= 70) highRiskCount++;
  });

  res.status(200).json(
    new ApiResponse(200, {
      department,
      summary: { total, openIncidents, highRiskCount, bySeverity },
      incidents,
    })
  );
});

const getHighRiskReport = asyncHandler(async (req, res) => {
  const threshold = parseInt(req.query.threshold) || 70;

  const incidents = await Incident.find({ 'aiAnalysis.riskScore': { $gte: threshold } })
    .populate('reporter', 'name email')
    .populate('department', 'name')
    .populate('assignedTo', 'name')
    .sort({ 'aiAnalysis.riskScore': -1 });

  res.status(200).json(
    new ApiResponse(200, {
      threshold,
      total: incidents.length,
      incidents,
    })
  );
});

module.exports = { getMonthlyReport, getDepartmentReport, getHighRiskReport };
