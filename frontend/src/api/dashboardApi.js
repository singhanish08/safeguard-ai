import axiosInstance from './axiosInstance';

export const getEmployeeDashboard = () => axiosInstance.get('/dashboard/employee');

export const getManagerDashboard = () => axiosInstance.get('/dashboard/manager');

export const getAdminDashboard = () => axiosInstance.get('/dashboard/admin');

export const getMonthlyReport = (params) => axiosInstance.get('/reports/monthly', { params });

export const getDepartmentReport = (params) => axiosInstance.get('/reports/department', { params });

export const getHighRiskReport = (params) => axiosInstance.get('/reports/high-risk', { params });
