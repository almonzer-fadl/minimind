"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import {
  LayoutDashboard,
  ClipboardList,
  CheckSquare,
  FileText,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  Folder,
  Plus,
  FolderOpen,
  File,
  Calendar,
  Star,
  Archive,
  Settings,
  User,
  LogOut,
  Search,
  Bell,
  X
} from 'lucide-react';

interface SidebarProps {
  activeView: 'overview' | 'boards' | 'tasks' | 'notes';
  setActiveView: (view: 'overview' | 'boards' | 'tasks' | 'notes') => void;
  user: { email: string } | null;
  onLogout: () => void;
  isMobileOpen?: boolean;
  onMobileToggle?: () => void;
}

export function Sidebar({ activeView, setActiveView, user, onLogout, isMobileOpen = false, onMobileToggle }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    boards: true,
    tasks: true,
    notes: true,
  });

  const [expandedFolders, setExpandedFolders] = useState({
    'boards-recent': false,
    'boards-starred': false,
    'tasks-today': false,
    'tasks-upcoming': false,
    'notes-recent': false,
    'notes-favorites': false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleFolder = (folder: keyof typeof expandedFolders) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folder]: !prev[folder]
    }));
  };

  const sidebarItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboard,
      onClick: () => setActiveView('overview'),
    },
    {
      id: 'boards',
      label: 'Boards',
      icon: ClipboardList,
      onClick: () => setActiveView('boards'),
      expandable: true,
      expanded: expandedSections.boards,
      onToggle: () => toggleSection('boards'),
      children: [
        {
          id: 'boards-recent',
          label: 'Recent',
          icon: Folder,
          expanded: expandedFolders['boards-recent'],
          onToggle: () => toggleFolder('boards-recent'),
          children: [
            { id: 'project-board', label: 'Project Board', icon: File, count: 12 },
            { id: 'marketing-board', label: 'Marketing Board', icon: File, count: 8 },
            { id: 'team-board', label: 'Team Board', icon: File, count: 5 },
          ]
        },
        {
          id: 'boards-starred',
          label: 'Starred',
          icon: Star,
          expanded: expandedFolders['boards-starred'],
          onToggle: () => toggleFolder('boards-starred'),
          children: [
            { id: 'main-project', label: 'Main Project', icon: File, count: 15 },
          ]
        },
      ]
    },
    {
      id: 'tasks',
      label: 'Tasks',
      icon: CheckSquare,
      onClick: () => setActiveView('tasks'),
      expandable: true,
      expanded: expandedSections.tasks,
      onToggle: () => toggleSection('tasks'),
      children: [
        {
          id: 'tasks-today',
          label: 'Today',
          icon: Calendar,
          expanded: expandedFolders['tasks-today'],
          onToggle: () => toggleFolder('tasks-today'),
          children: [
            { id: 'urgent-tasks', label: 'Urgent Tasks', icon: File, count: 3 },
            { id: 'meetings', label: 'Meetings', icon: File, count: 2 },
          ]
        },
        {
          id: 'tasks-upcoming',
          label: 'Upcoming',
          icon: ChevronRight,
          expanded: expandedFolders['tasks-upcoming'],
          onToggle: () => toggleFolder('tasks-upcoming'),
          children: [
            { id: 'next-week', label: 'Next Week', icon: File, count: 7 },
            { id: 'monthly-goals', label: 'Monthly Goals', icon: File, count: 4 },
          ]
        },
      ]
    },
    {
      id: 'notes',
      label: 'Notes',
      icon: FileText,
      onClick: () => setActiveView('notes'),
      expandable: true,
      expanded: expandedSections.notes,
      onToggle: () => toggleSection('notes'),
      children: [
        {
          id: 'notes-recent',
          label: 'Recent',
          icon: Folder,
          expanded: expandedFolders['notes-recent'],
          onToggle: () => toggleFolder('notes-recent'),
          children: [
            { id: 'meeting-notes', label: 'Meeting Notes', icon: File },
            { id: 'ideas', label: 'Ideas', icon: File },
            { id: 'research', label: 'Research', icon: File },
          ]
        },
        {
          id: 'notes-favorites',
          label: 'Favorites',
          icon: Star,
          expanded: expandedFolders['notes-favorites'],
          onToggle: () => toggleFolder('notes-favorites'),
          children: [
            { id: 'important-notes', label: 'Important Notes', icon: File },
          ]
        },
      ]
    },
  ];

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-80'} bg-white border-r border-gray-200 h-screen flex flex-col transition-all duration-300 ${
      isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    } fixed lg:relative z-50 lg:z-auto`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          {!isCollapsed && <h1 className="text-xl font-bold text-gray-900">Minimind</h1>}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="hidden lg:flex"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={onMobileToggle}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
        
        {/* Search Bar */}
        {!isCollapsed && (
          <div className="mb-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              placeholder="Search..." 
              className="w-full pl-10"
            />
          </div>
        )}

        {/* User Info */}
        {!isCollapsed && (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.email?.split('@')[0] || 'User'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email || 'user@example.com'}
              </p>
            </div>
          </div>
        )}
        
        {/* Collapsed User Avatar */}
        {isCollapsed && (
          <div className="flex justify-center">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className={`flex-1 overflow-y-auto p-2 ${isCollapsed ? 'scrollbar-hide' : ''}`}>
        {sidebarItems.map((item) => (
          <div key={item.id}>
            {/* Main Item */}
            <div className="flex items-center mb-1">
              <Button
                variant={activeView === item.id ? "secondary" : "ghost"}
                className="flex-1 justify-start"
                onClick={() => {
                  item.onClick();
                  // Close mobile sidebar on navigation
                  if (onMobileToggle && window.innerWidth < 1024) {
                    onMobileToggle();
                  }
                }}
              >
                <item.icon className="w-4 h-4 mr-2" />
                {!isCollapsed && <span className="flex-1 text-left">{item.label}</span>}
              </Button>
              
              {/* Expand/Collapse Button */}
              {item.expandable && !isCollapsed && (
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 h-auto"
                    onClick={(e) => {
                      e.stopPropagation();
                      item.onToggle?.();
                    }}
                  >
                    {item.expanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 h-auto"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Create new', item.id);
                    }}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Children */}
            {item.expanded && item.children && !isCollapsed && (
              <div className="ml-6 space-y-1 mb-2">
                {item.children.map((child) => (
                  <div key={child.id}>
                    {/* Folder */}
                    <div className="flex items-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 justify-start text-sm text-gray-600 hover:text-gray-900"
                        onClick={(e) => {
                          e.stopPropagation();
                          child.onToggle?.();
                        }}
                      >
                        {child.expanded ? (
                          <FolderOpen className="w-3 h-3 mr-2" />
                        ) : (
                          <child.icon className="w-3 h-3 mr-2" />
                        )}
                        <span className="flex-1 text-left">{child.label}</span>
                      </Button>
                      
                      {/* Folder Expand/Collapse Button */}
                      {child.children && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1 h-auto ml-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            child.onToggle?.();
                          }}
                        >
                          {child.expanded ? (
                            <ChevronDown className="w-3 h-3" />
                          ) : (
                            <ChevronRight className="w-3 h-3" />
                          )}
                        </Button>
                      )}
                    </div>

                    {/* Folder Children */}
                    {child.expanded && child.children && (
                      <div className="ml-6 space-y-1">
                        {child.children.map((grandChild) => (
                          <Button
                            key={grandChild.id}
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-sm text-gray-500 hover:text-gray-900"
                            onClick={() => {
                              // Handle file selection
                              console.log('Selected:', grandChild.id);
                            }}
                          >
                            <div className="w-5 mr-2" />
                            <grandChild.icon className="w-3 h-3 mr-2" />
                            <span className="flex-1 text-left">{grandChild.label}</span>
                            {'count' in grandChild && grandChild.count && (
                              <Badge variant="secondary" className="ml-2 text-xs">
                                {grandChild.count}
                              </Badge>
                            )}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        {/* Notifications */}
        {!isCollapsed && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
          >
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </Button>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          className={`${isCollapsed ? 'w-full justify-center' : 'w-full justify-start'}`}
        >
          <Settings className="w-4 h-4 mr-2" />
          {!isCollapsed && 'Settings'}
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className={`${isCollapsed ? 'w-full justify-center' : 'w-full justify-start'}`}
        >
          <Archive className="w-4 h-4 mr-2" />
          {!isCollapsed && 'Archive'}
        </Button>
        
        <Separator />
        
        <Button
          variant="ghost"
          size="sm"
          className={`${isCollapsed ? 'w-full justify-center' : 'w-full justify-start'} text-red-600 hover:text-red-700 hover:bg-red-50`}
          onClick={onLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          {!isCollapsed && 'Sign Out'}
        </Button>
      </div>
    </div>
  );
}
