"use client";

import { useState, useEffect } from 'react';
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
  onSettings?: () => void;
  onNotifications?: () => void;
  onArchive?: () => void;
  onCreateBoard?: () => void;
  onCreateTask?: () => void;
  onCreateNote?: () => void;
}

export function Sidebar({ activeView, setActiveView, user, onLogout, isMobileOpen = false, onMobileToggle, onSettings, onNotifications, onArchive, onCreateBoard, onCreateTask, onCreateNote }: SidebarProps) {
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

  // Real data from localStorage
  const [boards, setBoards] = useState<{ id: string; title: string; taskCount?: number; isStarred?: boolean }[]>([]);
  const [tasks, setTasks] = useState<{ id: string; title: string; priority?: string; status?: string; dueDate?: string }[]>([]);
  const [notes, setNotes] = useState<{ id: string; title: string; isStarred?: boolean }[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Load data from localStorage
  useEffect(() => {
    const loadData = () => {
      try {
        const boardsData = localStorage.getItem('boards');
        const tasksData = localStorage.getItem('tasks');
        const notesData = localStorage.getItem('notes');

        if (boardsData) setBoards(JSON.parse(boardsData));
        if (tasksData) setTasks(JSON.parse(tasksData));
        if (notesData) setNotes(JSON.parse(notesData));
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
    
    // Listen for data updates
    const handleStorageChange = () => loadData();
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('dataUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('dataUpdated', handleStorageChange);
    };
  }, []);

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

  const handleCreateNew = (itemId: string) => {
    switch (itemId) {
      case 'boards':
        if (onCreateBoard) {
          onCreateBoard();
        } else {
          // Fallback: switch to boards view
          setActiveView('boards');
        }
        break;
      case 'tasks':
        if (onCreateTask) {
          onCreateTask();
        } else {
          // Fallback: switch to tasks view
          setActiveView('tasks');
        }
        break;
      case 'notes':
        if (onCreateNote) {
          onCreateNote();
        } else {
          // Fallback: switch to notes view
          setActiveView('notes');
        }
        break;
      default:
        console.log('Create new item:', itemId);
    }
  };

  // Generate dynamic sidebar items based on real data
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
          children: boards.slice(0, 5).map(board => ({
            id: board.id,
            label: board.title,
            icon: File,
            count: board.taskCount || 0
          }))
        },
        {
          id: 'boards-starred',
          label: 'Starred',
          icon: Star,
          expanded: expandedFolders['boards-starred'],
          onToggle: () => toggleFolder('boards-starred'),
          children: boards.filter(board => board.isStarred).map(board => ({
            id: board.id,
            label: board.title,
            icon: File,
            count: board.taskCount || 0
          }))
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
            { id: 'urgent-tasks', label: 'Urgent Tasks', icon: File, count: tasks.filter(task => task.priority === 'high' && task.status !== 'done').length },
            { id: 'due-today', label: 'Due Today', icon: File, count: tasks.filter(task => task.dueDate && new Date(task.dueDate).toDateString() === new Date().toDateString()).length },
          ]
        },
        {
          id: 'tasks-upcoming',
          label: 'Upcoming',
          icon: ChevronRight,
          expanded: expandedFolders['tasks-upcoming'],
          onToggle: () => toggleFolder('tasks-upcoming'),
          children: [
            { id: 'in-progress', label: 'In Progress', icon: File, count: tasks.filter(task => task.status === 'in-progress').length },
            { id: 'pending', label: 'Pending', icon: File, count: tasks.filter(task => task.status === 'todo').length },
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
          children: notes.slice(0, 5).map(note => ({
            id: note.id,
            label: note.title,
            icon: File
          }))
        },
        {
          id: 'notes-favorites',
          label: 'Favorites',
          icon: Star,
          expanded: expandedFolders['notes-favorites'],
          onToggle: () => toggleFolder('notes-favorites'),
          children: notes.filter(note => note.isStarred).map(note => ({
            id: note.id,
            label: note.title,
            icon: File
          }))
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
                      handleCreateNew(item.id);
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
                            {(() => {
                              if ('count' in grandChild && grandChild.count) {
                                return (
                                  <Badge variant="secondary" className="ml-2 text-xs">
                                    {grandChild.count as number}
                                  </Badge>
                                );
                              }
                              return null;
                            })()}
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
            onClick={onNotifications}
          >
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </Button>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          className={`${isCollapsed ? 'w-full justify-center' : 'w-full justify-start'}`}
          onClick={onSettings}
        >
          <Settings className="w-4 h-4 mr-2" />
          {!isCollapsed && 'Settings'}
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className={`${isCollapsed ? 'w-full justify-center' : 'w-full justify-start'}`}
          onClick={onArchive}
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
