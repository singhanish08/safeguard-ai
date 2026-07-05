import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../../hooks/useAuth';
import { Menu, LogOut, Bell, RefreshCw, MessageSquare, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ThemeToggle from '../common/ThemeToggle';
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} from '../../api/notificationApi';

const notificationIcons = {
  new_incident: Bell,
  status_change: RefreshCw,
  remark_added: MessageSquare,
  system: User,
};

export default function Navbar({ onMenuToggle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const notificationRef = useRef(null);
  const prevUnreadRef = useRef(0);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const { data: unreadCount = 0 } = useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: () => getUnreadCount().then((response) => response.data.data.count),
    refetchInterval: 20000,
  });

  const { data: notifications = [], isLoading: notificationsLoading } = useQuery({
    queryKey: ['notifications', 'list'],
    queryFn: () => getNotifications().then((response) => response.data.data),
    enabled: isNotificationOpen,
    refetchInterval: 20000,
  });

  const refreshNotifications = () => {
    queryClient.invalidateQueries({ queryKey: ['notifications'] });
  };

  const readMutation = useMutation({
    mutationFn: markAsRead,
    onSuccess: refreshNotifications,
  });

  const readAllMutation = useMutation({
    mutationFn: markAllAsRead,
    onSuccess: refreshNotifications,
  });

  useEffect(() => {
    if (prevUnreadRef.current !== unreadCount) {
      queryClient.invalidateQueries({ queryKey: ['notifications', 'list'] });
      prevUnreadRef.current = unreadCount;
    }
  }, [unreadCount, queryClient]);

  useEffect(() => {
    if (!isNotificationOpen) return undefined;

    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isNotificationOpen]);

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await readMutation.mutateAsync(notification._id);
    }

    setIsNotificationOpen(false);
    if (notification.incidentId) {
      navigate(`/incidents/${notification.incidentId}`);
    }
  };

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <header className="h-[72px] bg-white/90 backdrop-blur-xl border-b border-slate-200/80 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button onClick={onMenuToggle} className="md:hidden p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg">
          <Menu className="w-5 h-5" />
        </button>
        <div><p className="text-sm font-semibold text-slate-900 sm:text-base">Welcome back, {user?.name?.split(' ')[0]}</p><p className="hidden text-xs text-slate-500 sm:block">Here’s what’s happening with safety today.</p></div>
      </div>

      <div className="flex items-center gap-1 sm:gap-3">
        <ThemeToggle />
        <div ref={notificationRef} className="relative">
          <button
            type="button"
            onClick={() => setIsNotificationOpen((current) => !current)}
            className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
            aria-expanded={isNotificationOpen}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex min-w-5 h-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          {isNotificationOpen && (
            <div className="absolute right-0 top-16 z-50 w-96 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-700">
                <h2 className="font-semibold text-slate-900 dark:text-white">Notifications</h2>
                <button
                  type="button"
                  onClick={() => readAllMutation.mutate()}
                  disabled={unreadCount === 0 || readAllMutation.isPending}
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  Mark all as read
                </button>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {notificationsLoading ? (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="flex gap-3 p-4">
                        <div className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
                        <div className="flex-1 space-y-2">
                          <div className="h-3 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                          <div className="h-3 w-full animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
                          <div className="h-2 w-1/3 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
                    <Bell className="mb-3 h-9 w-9 text-slate-300 dark:text-slate-600" />
                    <p className="text-sm text-slate-500 dark:text-slate-400">No notifications yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {notifications.map((notification) => {
                      const NotificationIcon = notificationIcons[notification.type] || User;
                      return (
                        <button
                          type="button"
                          key={notification._id}
                          onClick={() => handleNotificationClick(notification)}
                          className={`flex w-full gap-3 border-l-4 p-4 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 ${
                            notification.isRead
                              ? 'border-l-transparent bg-white dark:bg-slate-900'
                              : 'border-l-blue-500 bg-blue-50 dark:bg-blue-950'
                          }`}
                        >
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">
                            <NotificationIcon className="h-4 w-4" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium text-slate-900 dark:text-white">{notification.title}</span>
                            <span className="mt-0.5 block whitespace-normal break-words text-sm text-slate-500 dark:text-slate-400">{notification.message}</span>
                            <span className="mt-1 block text-xs text-slate-400">
                              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors font-medium"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
