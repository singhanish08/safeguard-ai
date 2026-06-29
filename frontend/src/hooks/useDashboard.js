import { useQuery } from '@tanstack/react-query';
import {
  getEmployeeDashboard,
  getManagerDashboard,
  getAdminDashboard,
} from '../api/dashboardApi';

export function useEmployeeDashboard() {
  return useQuery({
    queryKey: ['dashboard', 'employee'],
    queryFn: () => getEmployeeDashboard().then((r) => r.data.data),
  });
}

export function useManagerDashboard() {
  return useQuery({
    queryKey: ['dashboard', 'manager'],
    queryFn: () => getManagerDashboard().then((r) => r.data.data),
  });
}

export function useAdminDashboard() {
  return useQuery({
    queryKey: ['dashboard', 'admin'],
    queryFn: () => getAdminDashboard().then((r) => r.data.data),
  });
}
