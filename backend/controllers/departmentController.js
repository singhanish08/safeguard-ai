const Department = require('../models/Department');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const getAllDepartments = asyncHandler(async (req, res) => {
  const departments = await Department.find().populate('head', 'name email avatar').sort({ name: 1 });
  res.status(200).json(new ApiResponse(200, departments));
});

const getPublicDepartments = asyncHandler(async (req, res) => {
  const departments = await Department.find().select('_id name').sort({ name: 1 }).lean();
  res.status(200).json(new ApiResponse(200, departments));
});

const createDepartment = asyncHandler(async (req, res) => {
  const { name, description, head } = req.body;

  const exists = await Department.findOne({ name });
  if (exists) {
    throw new ApiError(400, 'Department already exists');
  }

  const department = await Department.create({ name, description, head });
  const populated = await Department.findById(department._id).populate('head', 'name email avatar');

  res.status(201).json(new ApiResponse(201, populated, 'Department created'));
});

const updateDepartment = asyncHandler(async (req, res) => {
  const { name, description, head } = req.body;
  const department = await Department.findById(req.params.id);

  if (!department) {
    throw new ApiError(404, 'Department not found');
  }

  if (name) department.name = name;
  if (description !== undefined) department.description = description;
  if (head !== undefined) department.head = head;

  await department.save();

  const populated = await Department.findById(department._id).populate('head', 'name email avatar');
  res.status(200).json(new ApiResponse(200, populated, 'Department updated'));
});

const deleteDepartment = asyncHandler(async (req, res) => {
  const department = await Department.findById(req.params.id);
  if (!department) {
    throw new ApiError(404, 'Department not found');
  }

  const incidentCount = await require('../models/Incident').countDocuments({ department: department._id });
  if (incidentCount > 0) {
    throw new ApiError(400, 'Cannot delete department with existing incidents');
  }

  await department.deleteOne();
  res.status(200).json(new ApiResponse(200, null, 'Department deleted'));
});

module.exports = { getAllDepartments, getPublicDepartments, createDepartment, updateDepartment, deleteDepartment };
