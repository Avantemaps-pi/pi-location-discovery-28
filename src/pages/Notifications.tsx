import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Bell, MessageSquare, Star, Store, Users, ThumbsUp } from 'lucide-react';

interface NotificationProps {
  type: 'message' | 'review' | 'business' | 'follower' | 'like';
  content: string;
  time: string;
  read: boolean;
}

const NotificationItem: React.FC<NotificationProps> = ({ type, content, time, read }) => {
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

  return (
    <div className={`p-4 border-b flex items-start ${read ? 'bg-white' : 'bg-blue-50'}`}>
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
  const notifications: NotificationProps[] = [
    {
      type: 'business',
      content: 'Your business "Coffee Pi" has been approved and is now listed on Avante Maps',
      time: '2 hours ago',
      read: false,
    },
    {
      type: 'review',
      content: 'Alex left a 5-star review on your business "Coffee Pi"',
      time: '5 hours ago',
      read: false,
    },
    {
      type: 'message',
      content: 'You have a new message from Sarah about your business hours',
      time: 'Yesterday',
      read: true,
    },
    {
      type: 'follower',
      content: 'John started following your profile',
      time: '2 days ago',
      read: true,
    },
    {
      type: 'like',
      content: 'Maria liked your forum post about Pi adoption',
      time: '3 days ago',
      read: true,
    },
    {
      type: 'business',
      content: 'Your business profile for "Tech Pi" has been viewed 24 times this week',
      time: '5 days ago',
      read: true,
    },
  ];

  return (
    <AppLayout title="Avante Maps">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Notifications</h1>
          <Button variant="outline" size="sm">Mark all as read</Button>
        </div>
        
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {notifications.length > 0 ? (
                notifications.map((notification, index) => (
                  <NotificationItem 
                    key={index}
                    type={notification.type}
                    content={notification.content}
                    time={notification.time}
                    read={notification.read}
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

