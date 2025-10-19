"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ClipboardList,
  CheckSquare,
  FileText,
  Plus,
} from 'lucide-react';

interface Stats {
  activeBoards: number;
  pendingTasks: number;
  totalNotes: number;
  completedTasksToday: number;
  tasksDueToday: number;
  notesCreatedThisWeek: number;
}

export default function Overview() {
  const [stats, setStats] = useState<Stats>({
    activeBoards: 0,
    pendingTasks: 0,
    totalNotes: 0,
    completedTasksToday: 0,
    tasksDueToday: 0,
    notesCreatedThisWeek: 0
  });

  useEffect(() => {
    // In a real app, this would fetch data from APIs
    // For now, we'll calculate from localStorage or use mock data
    const loadStats = () => {
      try {
        // Try to get data from localStorage (if it exists)
        const boardsData = localStorage.getItem('boards');
        const tasksData = localStorage.getItem('tasks');
        const notesData = localStorage.getItem('notes');

        let activeBoards = 0;
        let pendingTasks = 0;
        let totalNotes = 0;
        let completedTasksToday = 0;
        let tasksDueToday = 0;
        let notesCreatedThisWeek = 0;

        if (boardsData) {
          const boards = JSON.parse(boardsData);
          activeBoards = boards.filter((board: { status: string }) => board.status === 'active').length;
        }

        if (tasksData) {
          const tasks = JSON.parse(tasksData);
          pendingTasks = tasks.filter((task: { status: string }) => task.status !== 'done').length;
          completedTasksToday = tasks.filter((task: { status: string; updatedAt: string }) => {
            const today = new Date().toDateString();
            return task.status === 'done' && new Date(task.updatedAt).toDateString() === today;
          }).length;
          
          const today = new Date();
          tasksDueToday = tasks.filter((task: { dueDate?: string }) => {
            if (!task.dueDate) return false;
            const dueDate = new Date(task.dueDate);
            return dueDate.toDateString() === today.toDateString();
          }).length;
        }

        if (notesData) {
          const notes = JSON.parse(notesData);
          totalNotes = notes.length;
          
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          notesCreatedThisWeek = notes.filter((note: { createdAt: string }) => 
            new Date(note.createdAt) >= weekAgo
          ).length;
        }

        setStats({
          activeBoards,
          pendingTasks,
          totalNotes,
          completedTasksToday,
          tasksDueToday,
          notesCreatedThisWeek
        });
      } catch (error) {
        // Fallback to default stats if there's an error
        console.error('Error loading stats:', error);
        setStats({
          activeBoards: 3,
          pendingTasks: 5,
          totalNotes: 12,
          completedTasksToday: 2,
          tasksDueToday: 3,
          notesCreatedThisWeek: 4
        });
      }
    };

    loadStats();
    
    // Listen for changes in localStorage (when data is updated)
    const handleStorageChange = () => {
      loadStats();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events from the app
    window.addEventListener('dataUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('dataUpdated', handleStorageChange);
    };
  }, []);
  return (
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
            <div className="text-2xl font-bold">{stats.activeBoards}</div>
            <p className="text-xs text-muted-foreground">Active project boards</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingTasks}</div>
            <p className="text-xs text-muted-foreground">{stats.tasksDueToday} due today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Notes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalNotes}</div>
            <p className="text-xs text-muted-foreground">+{stats.notesCreatedThisWeek} this week</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button variant="outline" className="h-auto py-4">
            <Plus className="w-5 h-5 mr-3" />
            <div className="text-left">
              <p className="font-medium">Create New Board</p>
              <p className="text-sm text-gray-500">Start a new project</p>
            </div>
          </Button>
          <Button variant="outline" className="h-auto py-4">
            <Plus className="w-5 h-5 mr-3" />
            <div className="text-left">
              <p className="font-medium">Add New Task</p>
              <p className="text-sm text-gray-500">Quickly jot down a task</p>
            </div>
          </Button>
          <Button variant="outline" className="h-auto py-4">
            <Plus className="w-5 h-5 mr-3" />
            <div className="text-left">
              <p className="font-medium">Write New Note</p>
              <p className="text-sm text-gray-500">Capture an idea</p>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
