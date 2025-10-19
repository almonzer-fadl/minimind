"use client";

import { useState } from 'react';
import { useAuth, AuthGuard } from '@/lib/auth/auth-provider';
import { Button } from '@/components/ui/button';
import { ErrorBoundary } from '@/components/error-boundary';
import { Sidebar } from '@/components/sidebar/sidebar';
import Overview from '@/components/dashboard/overview';
import Boards from '@/components/dashboard/boards';
import Tasks from '@/components/dashboard/tasks';
import Notes from '@/components/dashboard/notes';
import {
  Menu
} from 'lucide-react';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [activeView, setActiveView] = useState<'overview' | 'boards' | 'tasks' | 'notes'>('overview');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [triggerCreate, setTriggerCreate] = useState<string | null>(null);

  const handleLogout = async () => {
    await logout();
  };

  const handleSettings = () => {
    // TODO: Implement settings modal/page
    alert('Settings feature coming soon!');
  };

  const handleNotifications = () => {
    // TODO: Implement notifications modal/page
    alert('Notifications feature coming soon!');
  };

  const handleArchive = () => {
    // TODO: Implement archive modal/page
    alert('Archive feature coming soon!');
  };

  const handleCreateBoard = () => {
    setActiveView('boards');
    setTriggerCreate('board');
    // Reset trigger after a short delay
    setTimeout(() => setTriggerCreate(null), 100);
  };

  const handleCreateTask = () => {
    setActiveView('tasks');
    setTriggerCreate('task');
    // Reset trigger after a short delay
    setTimeout(() => setTriggerCreate(null), 100);
  };

  const handleCreateNote = () => {
    setActiveView('notes');
    setTriggerCreate('note');
    // Reset trigger after a short delay
    setTimeout(() => setTriggerCreate(null), 100);
  };

  return (
    <AuthGuard>
      <ErrorBoundary>
        <div className="min-h-screen bg-gray-50 flex">
          {/* Sidebar */}
          <Sidebar
            activeView={activeView}
            setActiveView={setActiveView}
            user={user}
            onLogout={handleLogout}
            isMobileOpen={isMobileSidebarOpen}
            onMobileToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            onSettings={handleSettings}
            onNotifications={handleNotifications}
            onArchive={handleArchive}
            onCreateBoard={handleCreateBoard}
            onCreateTask={handleCreateTask}
            onCreateNote={handleCreateNote}
          />

          {/* Mobile Overlay */}
          {isMobileSidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
          )}

          {/* Main Content */}
          <main className="flex-1 overflow-auto min-h-screen">
            {/* Mobile Header */}
            <div className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <h1 className="text-lg font-semibold text-gray-900">Minimind</h1>
            </div>

            <div className="p-8">
              {activeView === 'overview' && <Overview />}
              
              {activeView === 'boards' && <Boards triggerCreate={triggerCreate === 'board'} />}

              {activeView === 'tasks' && <Tasks triggerCreate={triggerCreate === 'task'} />}

              {activeView === 'notes' && <Notes triggerCreate={triggerCreate === 'note'} />}
            </div>
          </main>
        </div>
      </ErrorBoundary>
    </AuthGuard>
  );
}