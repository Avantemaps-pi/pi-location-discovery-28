
import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Bell, MessageSquare, Star, Store, Users, ThumbsUp } from 'lucide-react';
import { toast } from 'sonner';

interface NotificationProps {
  id: string;
  type: 'message' | 'review' | 'business' | 'follower' | 'like';
  content: string;
  time: string;
  read: boolean;
}

// Create a global state for notifications that can be accessed across components
let globalNotifications: NotificationProps[] = [
  {
    id: '1',
    type: 'business',
    content: 'Your business "Business-name" has been listed',
    time: '2 hours ago',
    read: false,
  },
  {
    id: '2',
    type: 'review',
    content: 'User-name left a 5-star review on your business "Coffee Pi"',
    time: '5 hours ago',
    read: false,
  },
  {
    id: '3',
    type: 'business',
    content: 'Your business profile for "Tech Pi" has been viewed 24 times this week',
    time: '5 days ago',
    read: true,
  },
];

// Helper function to get unread notification count
export const getUnreadNotificationsCount = (): number => {
  return globalNotifications.filter(notification => !notification.read).length;
};

// Helper function to update a notification's read status
export const markNotificationAsRead = (id: string): void => {
  globalNotifications = globalNotifications.map(notification => 
    notification.id === id ? { ...notification, read: true } : notification
  );
};

// Helper function to mark all notifications as read
export const markAllNotificationsAsRead = (): void => {
  globalNotifications = globalNotifications.map(notification => ({ ...notification, read: true }));
};

// Custom event for notification updates
export const notificationUpdateEvent = new CustomEvent('notificationUpdate');

const NotificationItem: React.FC<{
  notification: NotificationProps;
  onReadNotification: (id: string) => void;
}> = ({ notification, onReadNotification }) => {
  const { type, content, time, read, id } = notification;
  
  const getIcon = () => {
    switch (type) {
      case 'message':
        return <MessageSquare className="h-5 w-5" />;
      case 'review':
        return <Star className="h-5 w-5" />;
      case 'business':
        return <Store className="h-5 w-5" />;
      case 'follower':
        return <Users className="h-5 w-5" />;
      case 'like':
        return <ThumbsUp className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'message':
        return 'text-blue-500 bg-blue-50';
      case 'review':
        return 'text-yellow-500 bg-yellow-50';
      case 'business':
        return 'text-green-500 bg-green-50';
      case 'follower':
        return 'text-purple-500 bg-purple-50';
      case 'like':
        return 'text-pink-500 bg-pink-50';
      default:
        return 'text-gray-500 bg-gray-50';
    }
  };

  const handleClick = () => {
    if (!notification.read) {
      onReadNotification(notification.id);
    }
  };

  return (
    <div 
      className={`p-4 border-b flex items-start ${read ? 'bg-white' : 'bg-blue-50'} cursor-pointer`}
      onClick={handleClick}
    >
      <div className={`p-2 rounded-full mr-4 ${getIconColor()}`}>
        {getIcon()}
      </div>
      <div className="flex-1">
        <p className={`${read ? 'text-gray-700' : 'font-medium text-gray-900'}`}>{content}</p>
        <p className="text-xs text-gray-500 mt-1">{time}</p>
      </div>
      {!read && (
        <div className="ml-2 h-2 w-2 rounded-full bg-blue-500"></div>
      )}
    </div>
  );
};

const Notifications = () => {
  const [notifications, setNotifications] = useState<NotificationProps[]>(globalNotifications);

  // Update local state when global state changes
  useEffect(() => {
    const updateNotifications = () => {
      setNotifications([...globalNotifications]);
    };

    // Listen for notification updates
    window.addEventListener('notificationUpdate', updateNotifications);

    return () => {
      window.removeEventListener('notificationUpdate', updateNotifications);
    };
  }, []);

  const markAsRead = (id: string) => {
    markNotificationAsRead(id);
    setNotifications(globalNotifications);
    // Dispatch event to notify other components
    window.dispatchEvent(notificationUpdateEvent);
  };

  const markAllAsRead = () => {
    markAllNotificationsAsRead();
    setNotifications(globalNotifications);
    toast.success('All notifications marked as read');
    // Dispatch event to notify other components
    window.dispatchEvent(notificationUpdateEvent);
  };

  const unreadCount = notifications.filter(notification => !notification.read).length;

  return (
    <AppLayout title="Avante Maps">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Notifications {unreadCount > 0 && 
            <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>}
          </h1>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            Mark all as read
          </Button>
        </div>
        
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <NotificationItem 
                    key={notification.id}
                    notification={notification}
                    onReadNotification={markAsRead}
                  />
                ))
              ) : (
                <div className="py-8 text-center">
                  <Bell className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500">No notifications yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Notifications;
