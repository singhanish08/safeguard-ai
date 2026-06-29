const User = require('../models/User');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const getAllUsers = asyncHandler(async (req, res) => {
  const { role, search, page = 1, limit = 10 } = req.query;
  const filter = {};

  if (role) filter.role = role;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [users, total] = await Promise.all([
    User.find(filter)
      .populate('department', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    User.countDocuments(filter),
  ]);

  res.status(200).json(
    new ApiResponse(200, {
      users,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    })
  );
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).populate('department', 'name');
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  res.status(200).json(new ApiResponse(200, user));
});

const updateUser = asyncHandler(async (req, res) => {
  const { name, email, role, department, isActive } = req.body;
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (name) user.name = name;
  if (email) user.email = email;
  if (role) user.role = role;
  if (department !== undefined) user.department = department;
  if (isActive !== undefined) user.isActive = isActive;

  await user.save();

  const updated = await User.findById(user._id).populate('department', 'name');
  res.status(200).json(new ApiResponse(200, updated, 'User updated'));
});

const toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  user.isActive = !user.isActive;
  await user.save();

  res.status(200).json(
    new ApiResponse(200, { isActive: user.isActive }, `User ${user.isActive ? 'activated' : 'deactivated'}`)
  );
});

const updateProfile = asyncHandler(async (req, res) => {
  const { name, department } = req.body;
  const user = await User.findById(req.user._id);

  if (name) user.name = name;
  if (department !== undefined) user.department = department;

  await user.save();

  const updated = await User.findById(user._id).populate('department', 'name');
  res.status(200).json(new ApiResponse(200, updated, 'Profile updated'));
});

module.exports = { getAllUsers, getUserById, updateUser, toggleUserStatus, updateProfile };
