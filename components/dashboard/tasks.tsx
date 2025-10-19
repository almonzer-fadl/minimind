"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { TaskListSkeleton } from '@/components/loading/task-skeleton';
import { ErrorState } from '@/components/ui/error-state';
import TaskDetail from '@/components/tasks/task-detail';
import {
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  MoreHorizontal,
  Star
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  assignee?: string;
  tags: string[];
  isStarred: boolean;
  checklist: { id: string; text: string; completed: boolean; createdAt: string }[];
  createdAt: string;
  updatedAt: string;
}

interface TasksProps {
  triggerCreate?: boolean;
}

export default function Tasks({ triggerCreate = false }: TasksProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Start with empty array - data will be loaded from localStorage or API
  const [tasks, setTasks] = useState<Task[]>([]);

  // Trigger create form when requested from sidebar
  useEffect(() => {
    if (triggerCreate) {
      setShowCreateForm(true);
    }
  }, [triggerCreate]);

  const handleCreateTask = async () => {
    if (!newTaskTitle.trim()) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newTask: Task = {
        id: Date.now().toString(),
        title: newTaskTitle,
        description: newTaskDescription,
        status: 'todo',
        priority: 'medium',
      assignee: undefined,
      tags: [],
      isStarred: false,
      checklist: [],
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
      };

      setTasks(prev => [newTask, ...prev]);
      setNewTaskTitle('');
      setNewTaskDescription('');
      setShowCreateForm(false);
      
      // Save to localStorage and trigger update
      const updatedTasks = [newTask, ...tasks];
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      window.dispatchEvent(new CustomEvent('dataUpdated'));
    } catch {
      setError('Failed to create task');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleTask = (taskId: string) => {
    setTasks(prev => {
      const updatedTasks = prev.map(task => {
        if (task.id === taskId) {
          const newStatus: 'todo' | 'in-progress' | 'done' = task.status === 'done' ? 'todo' : 'done';
          return { ...task, status: newStatus, updatedAt: new Date().toISOString().split('T')[0] };
        }
        return task;
      });
      
      // Save to localStorage and trigger update
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      window.dispatchEvent(new CustomEvent('dataUpdated'));
      
      return updatedTasks;
    });
  };

  const handleStarTask = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, isStarred: !task.isStarred }
        : task
    ));
  };

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const tasksByStatus = {
    todo: filteredTasks.filter(task => task.status === 'todo'),
    'in-progress': filteredTasks.filter(task => task.status === 'in-progress'),
    done: filteredTasks.filter(task => task.status === 'done')
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'todo':
        return <Circle className="w-4 h-4 text-gray-400" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'done':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      default:
        return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
  };

  // If a task is selected, show the task detail view
  if (selectedTask) {
    return <TaskDetail task={selectedTask} onBack={() => setSelectedTask(null)} onUpdate={handleUpdateTask} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tasks</h2>
          <p className="text-gray-600 mt-1">Stay organized and track your progress</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Create Task Form */}
      {showCreateForm && (
        <Card className="border-2 border-dashed border-gray-300">
          <CardHeader>
            <CardTitle>Create New Task</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Task Title</label>
              <Input
                placeholder="Enter task title..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Description (Optional)</label>
              <Input
                placeholder="Enter task description..."
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={handleCreateTask} disabled={isLoading || !newTaskTitle.trim()}>
                {isLoading ? 'Creating...' : 'Create Task'}
              </Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Task Lists */}
      {isLoading && tasks.length === 0 ? (
        <TaskListSkeleton />
      ) : error ? (
        <ErrorState
          title="Failed to load tasks"
          description="There was an error loading your tasks."
          error={error}
          onRetry={() => {
            setError(null);
            setIsLoading(true);
            setTimeout(() => setIsLoading(false), 1000);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* To Do */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Circle className="w-4 h-4 text-blue-500" />
                To Do
                <Badge variant="secondary">{tasksByStatus.todo.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {tasksByStatus.todo.map((task) => (
                <Card key={task.id} className="p-3 hover:shadow-sm transition-shadow cursor-pointer" onClick={() => setSelectedTask(task)}>
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleToggleTask(task.id)}
                      className="mt-1 hover:scale-110 transition-transform"
                    >
                      {getStatusIcon(task.status)}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 line-clamp-2">{task.title}</p>
                          {task.description && (
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{task.description}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-1 ml-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStarTask(task.id);
                            }}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <Star className={`w-3 h-3 ${task.isStarred ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <MoreHorizontal className="w-3 h-3 text-gray-400" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </Badge>
                        {task.dueDate && (
                          <div className={`flex items-center gap-1 text-xs ${
                            isOverdue(task.dueDate) ? 'text-red-600' : 'text-gray-500'
                          }`}>
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
              {tasksByStatus.todo.length === 0 && (
                <p className="text-center text-gray-500 text-sm py-4">No tasks to do</p>
              )}
            </CardContent>
          </Card>

          {/* In Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-yellow-500" />
                In Progress
                <Badge variant="secondary">{tasksByStatus['in-progress'].length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {tasksByStatus['in-progress'].map((task) => (
                <Card key={task.id} className="p-3 hover:shadow-sm transition-shadow cursor-pointer" onClick={() => setSelectedTask(task)}>
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleToggleTask(task.id)}
                      className="mt-1 hover:scale-110 transition-transform"
                    >
                      {getStatusIcon(task.status)}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 line-clamp-2">{task.title}</p>
                          {task.description && (
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{task.description}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-1 ml-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStarTask(task.id);
                            }}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <Star className={`w-3 h-3 ${task.isStarred ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <MoreHorizontal className="w-3 h-3 text-gray-400" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </Badge>
                        {task.dueDate && (
                          <div className={`flex items-center gap-1 text-xs ${
                            isOverdue(task.dueDate) ? 'text-red-600' : 'text-gray-500'
                          }`}>
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
              {tasksByStatus['in-progress'].length === 0 && (
                <p className="text-center text-gray-500 text-sm py-4">No tasks in progress</p>
              )}
            </CardContent>
          </Card>

          {/* Done */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                Done
                <Badge variant="secondary">{tasksByStatus.done.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {tasksByStatus.done.map((task) => (
                <Card key={task.id} className="p-3 hover:shadow-sm transition-shadow cursor-pointer opacity-75" onClick={() => setSelectedTask(task)}>
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleToggleTask(task.id)}
                      className="mt-1 hover:scale-110 transition-transform"
                    >
                      {getStatusIcon(task.status)}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 line-through line-clamp-2">{task.title}</p>
                          {task.description && (
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{task.description}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-1 ml-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStarTask(task.id);
                            }}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <Star className={`w-3 h-3 ${task.isStarred ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <MoreHorizontal className="w-3 h-3 text-gray-400" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          <span>Completed {new Date(task.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
              {tasksByStatus.done.length === 0 && (
                <p className="text-center text-gray-500 text-sm py-4">No completed tasks</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {filteredTasks.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <p className="text-gray-500">No tasks found matching &quot;{searchTerm}&quot;</p>
          <Button variant="outline" className="mt-4" onClick={() => setSearchTerm('')}>
            Clear search
          </Button>
        </div>
      )}
    </div>
  );
}
