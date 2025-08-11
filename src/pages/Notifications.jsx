import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Bell, Check, CheckCheck, Clock, Calendar, AlertCircle, Film, CreditCard, X } from 'lucide-react';
import toast from 'react-hot-toast';
import './Notifications.css';

const Notifications = () => {
  const { api, user } = useAppContext();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Fetch notifications
  const fetchNotifications = async (pageNum = 1, append = false) => {
    try {
      setLoading(true);
      const response = await api.get(`/api/notifications?page=${pageNum}&limit=20`);
      
      if (response.data.success) {
        const newNotifications = response.data.notifications;
        if (append) {
          setNotifications(prev => [...prev, ...newNotifications]);
        } else {
          setNotifications(newNotifications);
        }
        setHasMore(response.data.pagination.hasMore);
        setPage(pageNum);
      } else {
        toast.error('Failed to fetch notifications');
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  // Fetch unread count
  const fetchUnreadCount = async () => {
    try {
      const response = await api.get('/api/notifications/unread-count');
      if (response.data.success) {
        setUnreadCount(response.data.count);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      const response = await api.patch(`/api/notifications/${notificationId}/read`);
      if (response.data.success) {
        setNotifications(prev => 
          prev.map(notification => 
            notification._id === notificationId 
              ? { ...notification, isRead: true }
              : notification
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const response = await api.patch('/api/notifications/mark-all-read');
      if (response.data.success) {
        setNotifications(prev => 
          prev.map(notification => ({ ...notification, isRead: true }))
        );
        setUnreadCount(0);
        toast.success('All notifications marked as read');
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Failed to mark all notifications as read');
    }
  };

  // Load more notifications
  const loadMore = () => {
    if (hasMore && !loading) {
      fetchNotifications(page + 1, true);
    }
  };

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'booking':
        return <CreditCard size={20} />;
      case 'show':
        return <Film size={20} />;
      case 'reminder':
        return <Clock size={20} />;
      case 'cancellation':
        return <X size={20} />;
      default:
        return <Bell size={20} />;
    }
  };

  // Get notification color based on type
  const getNotificationColor = (type) => {
    switch (type) {
      case 'booking':
        return '#10B981'; // green
      case 'show':
        return '#3B82F6'; // blue
      case 'reminder':
        return '#F59E0B'; // amber
      case 'cancellation':
        return '#EF4444'; // red
      default:
        return '#6B7280'; // gray
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-IN');
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      fetchUnreadCount();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="notifications-container">
        <div className="notifications-empty">
          <Bell size={48} className="notifications-empty-icon" />
          <h2>Please login to view notifications</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <div className="notifications-title">
          <Bell size={24} />
          <h1>Notifications</h1>
          {unreadCount > 0 && (
            <span className="notifications-badge">{unreadCount}</span>
          )}
        </div>
        {unreadCount > 0 && (
          <button 
            onClick={markAllAsRead}
            className="mark-all-read-btn"
          >
            <CheckCheck size={16} />
            Mark all as read
          </button>
        )}
      </div>

      {loading && notifications.length === 0 ? (
        <div className="notifications-loading">
          <div className="loading-spinner"></div>
          <p>Loading notifications...</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="notifications-empty">
          <Bell size={48} className="notifications-empty-icon" />
          <h2>No notifications yet</h2>
          <p>You'll see notifications about your bookings, new shows, and reminders here.</p>
        </div>
      ) : (
        <div className="notifications-list">
          {notifications.map((notification) => (
            <div 
              key={notification._id} 
              className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
              onClick={() => !notification.isRead && markAsRead(notification._id)}
            >
              <div className="notification-icon" style={{ color: getNotificationColor(notification.type) }}>
                {getNotificationIcon(notification.type)}
              </div>
              <div className="notification-content">
                <div className="notification-header">
                  <h3 className="notification-title">{notification.title}</h3>
                  <span className="notification-time">
                    {formatDate(notification.createdAt)}
                  </span>
                </div>
                <p className="notification-message">{notification.message}</p>
                {!notification.isRead && (
                  <div className="notification-status">
                    <div className="unread-indicator"></div>
                    <span>New</span>
                  </div>
                )}
              </div>
              {!notification.isRead && (
                <button 
                  className="mark-read-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    markAsRead(notification._id);
                  }}
                >
                  <Check size={16} />
                </button>
              )}
            </div>
          ))}
          
          {hasMore && (
            <div className="load-more-container">
              <button 
                onClick={loadMore}
                disabled={loading}
                className="load-more-btn"
              >
                {loading ? 'Loading...' : 'Load more'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications; 