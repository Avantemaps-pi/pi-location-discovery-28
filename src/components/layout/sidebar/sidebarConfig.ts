
import {
  Map,
  Monitor,
  Bookmark,
  Bell,
  Building,
  MessageSquare,
  Settings,
  Info,
  Lock,
  FileText,
  Phone
} from 'lucide-react';

// Create a function to dynamically get the notification count
import { getUnreadNotificationsCount } from '@/utils/notificationUtils';

export const navItems = [
  {
    to: '/',
    icon: Map,
    label: 'Map',
  },
  {
    to: '/recommendations',
    icon: Monitor,
    label: 'Recommendations',
  },
  {
    to: '/bookmarks',
    icon: Bookmark,
    label: 'Bookmarks',
  },
  {
    to: '/notifications',
    icon: Bell,
    label: 'Notifications',
    badge: getUnreadNotificationsCount(),
  },
  {
    to: '/registered-business',
    icon: Building,
    label: 'Registered Business',
  },
  {
    to: '/communicon',
    icon: MessageSquare,
    label: 'CommuniCon',
  },
  {
    to: '/settings',
    icon: Settings,
    label: 'Settings',
  },
  {
    to: '/contact',
    icon: Phone,
    label: 'Contact Us',
  },
  {
    to: '/about',
    icon: Info,
    label: 'About Us',
  },
];

export const legalItems = [
  {
    to: '/privacy-policy',
    icon: Lock,
    label: 'Privacy Policy',
  },
  {
    to: '/terms-of-service',
    icon: FileText,
    label: 'Terms of Service',
  },
];
