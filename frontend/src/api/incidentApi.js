import axiosInstance from './axiosInstance';

export const createIncident = (data) =>
  axiosInstance.post('/incidents', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const getAllIncidents = (params) => axiosInstance.get('/incidents', { params });

export const getMyIncidents = (params) => axiosInstance.get('/incidents/my', { params });

export const getIncidentById = (id) => axiosInstance.get(`/incidents/${id}`);

export const updateIncidentStatus = (id, data) => axiosInstance.put(`/incidents/${id}/status`, data);

export const updateIncidentRemarks = (id, data) => axiosInstance.put(`/incidents/${id}/remarks`, data);

export const assignIncident = (id, data) => axiosInstance.put(`/incidents/${id}/assign`, data);

export const deleteIncident = (id) => axiosInstance.delete(`/incidents/${id}`);
