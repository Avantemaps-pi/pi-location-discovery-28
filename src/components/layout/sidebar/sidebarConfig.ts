
import { 
  Home, 
  Compass, 
  Bookmark, 
  Mail, 
  Info, 
  Settings,
  FileText,
  User,
  Bell,
  Building2,
  ClipboardList
} from 'lucide-react';

export const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/recommendations', icon: Compass, label: 'Recommendations' },
  { to: '/bookmarks', icon: Bookmark, label: 'Bookmarks' },
  { to: '/communicon', icon: User, label: 'Communicon' },
  { to: '/notifications', icon: Bell, label: 'Notifications', badge: 2 },
  { to: '/registered-business', icon: Building2, label: 'My Businesses' },
  { to: '/registration', icon: ClipboardList, label: 'Register Business' },
  { to: '/contact', icon: Mail, label: 'Contact' },
  { to: '/about', icon: Info, label: 'About Us' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export const legalItems = [
  { to: '/terms', icon: FileText, label: 'Terms of Service' },
  { to: '/privacy', icon: FileText, label: 'Privacy Policy' },
  { to: '/cookies', icon: FileText, label: 'Cookie Policy' },
];
