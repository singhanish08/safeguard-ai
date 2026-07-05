import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllIncidents,
  getMyIncidents,
  getIncidentById,
  createIncident,
  updateIncidentStatus,
  updateIncidentRemarks,
  assignIncident,
  deleteIncident,
} from '../api/incidentApi';

export function useIncidents(params) {
  return useQuery({
    queryKey: ['incidents', params],
    queryFn: () => getAllIncidents(params).then((r) => r.data.data),
  });
}

export function useMyIncidents(params) {
  return useQuery({
    queryKey: ['myIncidents', params],
    queryFn: () => getMyIncidents(params).then((r) => r.data.data),
  });
}

export function useIncident(id) {
  return useQuery({
    queryKey: ['incident', id],
    queryFn: () => getIncidentById(id).then((r) => r.data.data),
    enabled: !!id,
  });
}

export function useCreateIncident() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => createIncident(data).then((r) => r.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
      queryClient.invalidateQueries({ queryKey: ['myIncidents'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useUpdateStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateIncidentStatus(id, data).then((r) => r.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incident'] });
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useUpdateRemarks() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateIncidentRemarks(id, data).then((r) => r.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incident'] });
    },
  });
}

export function useAssignIncident() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => assignIncident(id, data).then((r) => r.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incident'] });
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useDeleteIncident() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteIncident(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
