
import React from 'react';
import { Bell, MessageSquare, Star, Store, Users, ThumbsUp } from 'lucide-react';
import { NotificationProps } from '@/types/notification';

interface NotificationItemProps {
  notification: NotificationProps;
  onReadNotification: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onReadNotification }) => {
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

export default NotificationItem;
