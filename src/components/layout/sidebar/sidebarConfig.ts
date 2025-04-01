
import { GalleryVertical, Map, Bookmark, MessageSquare, Bell, Building, Info, Settings, Phone, Shield, FileText, Trash2 } from 'lucide-react';

export const navItems = [
  {
    to: "/",
    icon: Map,
    label: "Map"
  },
  {
    to: "/recommendations",
    icon: GalleryVertical,
    label: "Recommendations"
  },
  {
    to: "/bookmarks",
    icon: Bookmark,
    label: "Bookmarks"
  },
  {
    to: "/communicon",
    icon: MessageSquare,
    label: "Communicon"
  },
  {
    to: "/notifications",
    icon: Bell,
    label: "Notifications"
  },
  {
    to: "/registered-business",
    icon: Building,
    label: "My Business"
  },
  {
    to: "/about",
    icon: Info,
    label: "About"
  },
  {
    to: "/settings",
    icon: Settings,
    label: "Settings"
  },
  {
    to: "/contact",
    icon: Phone,
    label: "Contact Us"
  }
];

export const legalItems = [
  {
    to: "/terms",
    icon: FileText,
    label: "Terms of Service"
  },
  {
    to: "/privacy",
    icon: Shield,
    label: "Privacy Policy"
  },
  {
    to: "/cookies",
    icon: Trash2,
    label: "Cookie Policy"
  }
];
