
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useSidebar } from './context';
import { Home, Map, Bookmark, MessageSquare, Bell, Building, Info, Settings, Phone } from 'lucide-react';

const SidebarMenu = () => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  const links = [
    { name: 'Map', href: '/', icon: Home },
    { name: 'Explore', href: '/explore', icon: Map },
    { name: 'Bookmarks', href: '/bookmarks', icon: Bookmark },
    { name: 'Communicon', href: '/communicon', icon: MessageSquare },
    { name: 'Notifications', href: '/notifications', icon: Bell },
    { name: 'My Business', href: '/registered-business', icon: Building },
    { name: 'About', href: '/about', icon: Info },
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'Contact Us', href: '/contact', icon: Phone },
  ];

  return (
    <div className={cn("grid gap-2", collapsed ? "px-2" : "px-4")}>
      {links.map((link) => {
        const isActive = location.pathname === link.href;
        
        return (
          <NavLink 
            key={link.name} 
            to={link.href} 
            className={cn("flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary", 
              isActive ? "bg-muted font-medium text-primary" : "text-muted-foreground",
              collapsed ? "justify-center" : ""
            )}
          >
            <link.icon className="h-4 w-4" />
            {!collapsed && <span>{link.name}</span>}
          </NavLink>
        );
      })}
    </div>
  );
};

export default SidebarMenu;
