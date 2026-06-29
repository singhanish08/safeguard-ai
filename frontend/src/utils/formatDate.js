import { format, formatDistanceToNow } from 'date-fns';

export function formatDate(date) {
  if (!date) return 'N/A';
  return format(new Date(date), 'MMM dd, yyyy');
}

export function formatDateTime(date) {
  if (!date) return 'N/A';
  return format(new Date(date), 'MMM dd, yyyy hh:mm a');
}

export function timeAgo(date) {
  if (!date) return 'N/A';
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}
