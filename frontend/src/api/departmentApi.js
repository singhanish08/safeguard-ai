import axiosInstance from './axiosInstance';

export const getAllDepartments = () => axiosInstance.get('/departments');

export const getPublicDepartments = () => axiosInstance.get('/departments/public');

export const createDepartment = (data) => axiosInstance.post('/departments', data);

export const updateDepartment = (id, data) => axiosInstance.put(`/departments/${id}`, data);

export const deleteDepartment = (id) => axiosInstance.delete(`/departments/${id}`);
