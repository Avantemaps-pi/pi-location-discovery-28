
import React from 'react';
import { Bell } from 'lucide-react';

const EmptyNotifications: React.FC = () => {
  return (
    <div className="py-8 text-center">
      <Bell className="h-12 w-12 mx-auto text-gray-300 mb-3" />
      <p className="text-gray-500">No notifications yet</p>
    </div>
  );
};

export default EmptyNotifications;
