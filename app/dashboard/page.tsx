"use client";

import { useState } from 'react';
import { useAuth, AuthGuard } from '@/lib/auth/auth-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ErrorBoundary } from '@/components/error-boundary';
import { BoardListSkeleton } from '@/components/loading/board-skeleton';
import { TaskListSkeleton } from '@/components/loading/task-skeleton';
import { NoteListSkeleton } from '@/components/loading/note-skeleton';
import { ErrorState } from '@/components/ui/error-state';
import { Sidebar } from '@/components/sidebar/sidebar';
import { 
  ClipboardList, 
  CheckSquare, 
  FileText, 
  Plus, 
  Calendar,
  Tag,
  Filter,
  Menu
} from 'lucide-react';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [activeView, setActiveView] = useState<'overview' | 'boards' | 'tasks' | 'notes'>('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [taskStates, setTaskStates] = useState({
    'task-1': false,
    'task-2': false,
    'task-3': false,
    'task-4': false,
    'task-5': false,
  });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  const handleTaskToggle = (taskId: keyof typeof taskStates) => {
    setTaskStates(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };


  return (
    <AuthGuard>
      <ErrorBoundary>
        <div className="min-h-screen bg-gray-50">
          {/* Sidebar */}
          <Sidebar 
            activeView={activeView}
            setActiveView={setActiveView}
            user={user}
            onLogout={handleLogout}
            isMobileOpen={isMobileSidebarOpen}
            onMobileToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          />

          {/* Mobile Overlay */}
          {isMobileSidebarOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
          )}

          {/* Main Content */}
          <main className="lg:ml-80 overflow-auto min-h-screen">
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
          {activeView === 'overview' && (
            <div className="space-y-8">
              {/* Welcome Section */}
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h2>
                <p className="text-gray-600">Here&apos;s what&apos;s happening with your productivity today.</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Boards</CardTitle>
                    <ClipboardList className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">0</div>
                    <p className="text-xs text-muted-foreground">
                      +0 from last week
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
                    <CheckSquare className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">0</div>
                    <p className="text-xs text-muted-foreground">
                      +0 from yesterday
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Notes</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">0</div>
                    <p className="text-xs text-muted-foreground">
                      +0 from last month
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveView('boards')}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <ClipboardList className="w-5 h-5 text-blue-600" />
                      </div>
                      Boards
                    </CardTitle>
                    <CardDescription>
                      Organize your projects with Trello-style boards and lists
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Board
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveView('tasks')}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <CheckSquare className="w-5 h-5 text-green-600" />
                      </div>
                      Tasks
                    </CardTitle>
                    <CardDescription>
                      Simple, minimalist to-do list for your daily tasks
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Task
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveView('notes')}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-purple-600" />
                      </div>
                      Notes
                    </CardTitle>
                    <CardDescription>
                      Rich text editor for your thoughts and ideas
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Note
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeView === 'boards' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Boards</h2>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Board
                </Button>
              </div>
              
              {/* Boards Grid */}
              {isLoading ? (
                <BoardListSkeleton />
              ) : error ? (
                <ErrorState 
                  title="Failed to load boards"
                  description="There was an error loading your boards."
                  error={error}
                  onRetry={() => {
                    setError(null);
                    setIsLoading(true);
                    // Simulate loading
                    setTimeout(() => setIsLoading(false), 1000);
                  }}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>My Project Board</span>
                      <Badge variant="secondary">Active</Badge>
                    </CardTitle>
                    <CardDescription>
                      3 lists • 12 cards • Updated 2 hours ago
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span>To Do (5)</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span>In Progress (4)</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span>Done (3)</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed border-2 border-gray-300">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Plus className="w-8 h-8 text-gray-400 mb-4" />
                    <p className="text-gray-500">Create new board</p>
                  </CardContent>
                </Card>
                </div>
              )}
            </div>
          )}

          {activeView === 'tasks' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Tasks</h2>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Task
                  </Button>
                </div>
              </div>

              {/* Task Lists */}
              {isLoading ? (
                <TaskListSkeleton />
              ) : error ? (
                <ErrorState 
                  title="Failed to load tasks"
                  description="There was an error loading your tasks."
                  error={error}
                  onRetry={() => {
                    setError(null);
                    setIsLoading(true);
                    // Simulate loading
                    setTimeout(() => setIsLoading(false), 1000);
                  }}
                />
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* To Do */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      To Do
                      <Badge variant="secondary">3</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Card className="p-3 hover:shadow-sm transition-shadow cursor-pointer">
                      <div className="flex items-start gap-3">
                        <input 
                          type="checkbox" 
                          className="mt-1" 
                          checked={taskStates['task-1']}
                          onChange={() => handleTaskToggle('task-1')}
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Review project proposal</p>
                          <p className="text-xs text-gray-500 mt-1">Due tomorrow</p>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-3 hover:shadow-sm transition-shadow cursor-pointer">
                      <div className="flex items-start gap-3">
                        <input 
                          type="checkbox" 
                          className="mt-1" 
                          checked={taskStates['task-2']}
                          onChange={() => handleTaskToggle('task-2')}
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Update documentation</p>
                          <p className="text-xs text-gray-500 mt-1">No due date</p>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-3 hover:shadow-sm transition-shadow cursor-pointer">
                      <div className="flex items-start gap-3">
                        <input 
                          type="checkbox" 
                          className="mt-1" 
                          checked={taskStates['task-3']}
                          onChange={() => handleTaskToggle('task-3')}
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Team meeting prep</p>
                          <p className="text-xs text-gray-500 mt-1">Due Friday</p>
                        </div>
                      </div>
                    </Card>
                  </CardContent>
                </Card>

                {/* In Progress */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      In Progress
                      <Badge variant="secondary">2</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Card className="p-3 hover:shadow-sm transition-shadow cursor-pointer">
                      <div className="flex items-start gap-3">
                        <input 
                          type="checkbox" 
                          className="mt-1" 
                          checked={taskStates['task-4']}
                          onChange={() => handleTaskToggle('task-4')}
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Design new feature</p>
                          <p className="text-xs text-gray-500 mt-1">Due next week</p>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-3 hover:shadow-sm transition-shadow cursor-pointer">
                      <div className="flex items-start gap-3">
                        <input 
                          type="checkbox" 
                          className="mt-1" 
                          checked={taskStates['task-5']}
                          onChange={() => handleTaskToggle('task-5')}
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Code review</p>
                          <p className="text-xs text-gray-500 mt-1">Due today</p>
                        </div>
                      </div>
                    </Card>
                  </CardContent>
                </Card>

                {/* Done */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      Done
                      <Badge variant="secondary">1</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Card className="p-3 hover:shadow-sm transition-shadow cursor-pointer opacity-60">
                      <div className="flex items-start gap-3">
                        <input type="checkbox" defaultChecked readOnly className="mt-1" />
                        <div className="flex-1">
                          <p className="text-sm font-medium line-through">Setup development environment</p>
                          <p className="text-xs text-gray-500 mt-1">Completed yesterday</p>
                        </div>
                      </div>
                    </Card>
                  </CardContent>
                </Card>
                </div>
              )}
            </div>
          )}

          {activeView === 'notes' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Notes</h2>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Tag className="w-4 h-4 mr-2" />
                    Tags
                  </Button>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Note
                  </Button>
                </div>
              </div>

              {/* Notes Grid */}
              {isLoading ? (
                <NoteListSkeleton />
              ) : error ? (
                <ErrorState 
                  title="Failed to load notes"
                  description="There was an error loading your notes."
                  error={error}
                  onRetry={() => {
                    setError(null);
                    setIsLoading(true);
                    // Simulate loading
                    setTimeout(() => setIsLoading(false), 1000);
                  }}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-lg">Meeting Notes - Q4 Planning</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Updated 2 hours ago
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-3">
                      Discussed quarterly goals, budget allocation, and team expansion plans. 
                      Key decisions made on project priorities...
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">work</Badge>
                      <Badge variant="secondary" className="text-xs">meeting</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-lg">Ideas for New Feature</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Updated yesterday
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-3">
                      Brainstorming session results for the upcoming feature release. 
                      User feedback analysis and technical considerations...
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">ideas</Badge>
                      <Badge variant="secondary" className="text-xs">feature</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed border-2 border-gray-300">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Plus className="w-8 h-8 text-gray-400 mb-4" />
                    <p className="text-gray-500">Create new note</p>
                  </CardContent>
                </Card>
                </div>
              )}
            </div>
          )}
            </div>
          </main>
        </div>
      </ErrorBoundary>
    </AuthGuard>
  );
}