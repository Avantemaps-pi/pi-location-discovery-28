import { LayoutDashboard, Map, Bell, Award, Book, Phone, Shield, FileText, LucideIcon, Settings, LogOut } from 'lucide-react';

interface NavItem {
  to: string;
  icon: LucideIcon;
  label: string;
  badge?: number | null;
}

// Add logout as the first item in the navigation
export const navItems: NavItem[] = [
  {
    to: "/logout", // Special route that will be handled by the NavItem component
    icon: LogOut,
    label: "Logout",
  },
  {
    to: "/",
    icon: Map,
    label: "Map",
  },
  {
    to: "/notifications",
    icon: Bell,
    label: "Notifications",
    badge: 3, // Example badge count
  },
  {
    to: "/analytics",
    icon: LayoutDashboard,
    label: "Analytics",
  },
  {
    to: "/rewards",
    icon: Award,
    label: "Rewards",
  },
];

interface LegalItem {
  to: string;
  icon: LucideIcon;
  label: string;
}

export const legalItems: LegalItem[] = [
  {
    to: "/terms",
    icon: FileText,
    label: "Terms",
  },
  {
    to: "/privacy",
    icon: Shield,
    label: "Privacy",
  },
  {
    to: "/contact",
    icon: Phone,
    label: "Contact",
  },
  {
    to: "/settings",
    icon: Settings,
    label: "Settings",
  },
  {
    to: "/about",
    icon: Book,
    label: "About",
  },
];
