"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ThemeProvider } from '@/lib/theme/theme-provider';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Button } from '@/components/ui/button';
import { LogOut, Plus, Layout, CheckSquare, FileText } from 'lucide-react';

interface User {
  id: string;
  email: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/users/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        router.push('/auth/signin');
      }
    } catch (error) {
      router.push('/auth/signin');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (isLoading) {
    return (
      <ThemeProvider defaultTheme="system" storageKey="minimind-theme">
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your mind...</p>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <ThemeProvider defaultTheme="system" storageKey="minimind-theme">
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 max-w-screen-2xl items-center">
            <div className="mr-4 flex">
              <div className="mr-6 flex items-center space-x-2">
                <div className="h-6 w-6 rounded bg-primary"></div>
                <span className="font-bold text-xl">Minimind</span>
              </div>
            </div>
            <div className="flex flex-1 items-center justify-between">
              <nav className="flex items-center space-x-6 text-sm font-medium">
                <span className="transition-colors text-foreground/60">
                  Welcome back, {user.email}
                </span>
              </nav>
              <div className="flex items-center space-x-2">
                <ThemeToggle />
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container py-8">
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">
                Your Organized Mind
              </h1>
              <p className="text-muted-foreground">
                Everything you need to stay productive, all in one place.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Layout className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold">Boards</h3>
                      <p className="text-sm text-muted-foreground">
                        Organize your projects
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button className="w-full" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Board
                    </Button>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <CheckSquare className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold">Tasks</h3>
                      <p className="text-sm text-muted-foreground">
                        Manage your to-dos
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button className="w-full" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Task
                    </Button>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold">Notes</h3>
                      <p className="text-sm text-muted-foreground">
                        Capture your thoughts
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button className="w-full" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      New Note
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-6">
                <h3 className="font-semibold mb-4">Recent Activity</h3>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No activity yet. Start by creating your first board, task, or note!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}
