import {
  Home,
  Star,
  Bookmark,
  Bell,
  BarChart,
  ShieldCheck,
  MessageCircle,
  Settings,
  Info,
  Lock,
  FileText,
} from 'lucide-react';

// Create a function to dynamically get the notification count
import { getUnreadNotificationsCount } from '@/utils/notificationUtils';

export const navItems = [
  {
    to: '/',
    icon: Home,
    label: 'Map',
  },
  {
    to: '/recommendations',
    icon: Star,
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
    to: '/analytics',
    icon: BarChart,
    label: 'Analytics',
  },
  {
    to: '/verifications',
    icon: ShieldCheck,
    label: 'Verifications',
  },
  {
    to: '/communicon',
    icon: MessageCircle,
    label: 'CommuniCon',
  },
  {
    to: '/settings',
    icon: Settings,
    label: 'Settings',
  },
];

export const legalItems = [
  {
    to: '/about',
    icon: Info,
    label: 'About',
  },
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
