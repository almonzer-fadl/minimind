"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Tag,
  CheckSquare,
  Plus,
  Edit,
  Save,
  X
} from 'lucide-react';

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

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
  checklist: ChecklistItem[];
  createdAt: string;
  updatedAt: string;
}

interface TaskDetailProps {
  task: Task;
  onBack: () => void;
  onUpdate: (updatedTask: Task) => void;
}

export default function TaskDetail({ task, onBack, onUpdate }: TaskDetailProps) {
  const [editingTask, setEditingTask] = useState<Task>(task);
  const [isEditing, setIsEditing] = useState(false);
  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [newTag, setNewTag] = useState('');

  const handleUpdateTask = () => {
    onUpdate({ ...editingTask, updatedAt: new Date().toISOString() });
    setIsEditing(false);
  };

  const handleAddChecklistItem = () => {
    if (!newChecklistItem.trim()) return;

    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      text: newChecklistItem,
      completed: false,
      createdAt: new Date().toISOString()
    };

    setEditingTask(prev => ({
      ...prev,
      checklist: [...prev.checklist, newItem]
    }));

    setNewChecklistItem('');
  };

  const handleToggleChecklistItem = (itemId: string) => {
    setEditingTask(prev => ({
      ...prev,
      checklist: prev.checklist.map(item =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      )
    }));
  };

  const handleAddTag = () => {
    if (!newTag.trim() || editingTask.tags.includes(newTag)) return;

    setEditingTask(prev => ({
      ...prev,
      tags: [...prev.tags, newTag.trim()]
    }));

    setNewTag('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setEditingTask(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleStarTask = () => {
    setEditingTask(prev => ({
      ...prev,
      isStarred: !prev.isStarred
    }));
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800 border-green-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      high: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      todo: 'bg-blue-100 text-blue-800 border-blue-200',
      'in-progress': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      done: 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[status as keyof typeof colors] || colors.todo;
  };

  const completedChecklistItems = editingTask.checklist.filter(item => item.completed).length;
  const totalChecklistItems = editingTask.checklist.length;
  const checklistProgress = totalChecklistItems > 0 ? (completedChecklistItems / totalChecklistItems) * 100 : 0;

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Tasks
        </Button>
      </div>

      {/* Task Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {isEditing ? (
                <Input
                  value={editingTask.title}
                  onChange={(e) => setEditingTask(prev => ({ ...prev, title: e.target.value }))}
                  className="text-xl font-bold border-none p-0 h-auto"
                />
              ) : (
                <CardTitle className="text-xl flex items-center gap-2">
                  {editingTask.title}
                  <button onClick={handleStarTask} className="hover:scale-110 transition-transform">
                    <span className={editingTask.isStarred ? 'text-yellow-400' : 'text-gray-400'}>
                      ★
                    </span>
                  </button>
                </CardTitle>
              )}
            </div>
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <Button size="sm" onClick={handleUpdateTask}>
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </>
              ) : (
                <Button size="sm" onClick={() => setIsEditing(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Status and Priority */}
          <div className="flex items-center gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Status</label>
              {isEditing ? (
                <Select
                  value={editingTask.status}
                  onValueChange={(value: 'todo' | 'in-progress' | 'done') =>
                    setEditingTask(prev => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Badge className={getStatusColor(editingTask.status)}>
                  {editingTask.status.replace('-', ' ')}
                </Badge>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Priority</label>
              {isEditing ? (
                <Select
                  value={editingTask.priority}
                  onValueChange={(value: 'low' | 'medium' | 'high') =>
                    setEditingTask(prev => ({ ...prev, priority: value }))
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Badge className={getPriorityColor(editingTask.priority)}>
                  {editingTask.priority}
                </Badge>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-gray-700">Description</label>
            {isEditing ? (
              <Textarea
                value={editingTask.description || ''}
                onChange={(e) => setEditingTask(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Add a description..."
                className="mt-1"
              />
            ) : (
              <p className="text-gray-600 mt-1">
                {editingTask.description || 'No description provided'}
              </p>
            )}
          </div>

          {/* Due Date */}
          <div>
            <label className="text-sm font-medium text-gray-700">Due Date</label>
            {isEditing ? (
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="w-4 h-4 text-gray-400" />
                <Input
                  type="date"
                  value={editingTask.dueDate || ''}
                  onChange={(e) => setEditingTask(prev => ({ ...prev, dueDate: e.target.value || undefined }))}
                  className="w-40"
                />
              </div>
            ) : (
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className={editingTask.dueDate && isOverdue(editingTask.dueDate) ? 'text-red-600' : 'text-gray-600'}>
                  {editingTask.dueDate 
                    ? new Date(editingTask.dueDate).toLocaleDateString()
                    : 'No due date set'
                  }
                </span>
              </div>
            )}
          </div>

          {/* Assignee */}
          <div>
            <label className="text-sm font-medium text-gray-700">Assignee</label>
            {isEditing ? (
              <div className="flex items-center gap-2 mt-1">
                <User className="w-4 h-4 text-gray-400" />
                <Input
                  value={editingTask.assignee || ''}
                  onChange={(e) => setEditingTask(prev => ({ ...prev, assignee: e.target.value || undefined }))}
                  placeholder="Assign to someone..."
                  className="w-48"
                />
              </div>
            ) : (
              <div className="flex items-center gap-2 mt-1">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">
                  {editingTask.assignee || 'Unassigned'}
                </span>
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="text-sm font-medium text-gray-700">Tags</label>
            <div className="flex items-center gap-2 mt-1">
              <Tag className="w-4 h-4 text-gray-400" />
              <div className="flex flex-wrap gap-2 flex-1">
                {editingTask.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                    {isEditing && (
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-red-600"
                      >
                        ×
                      </button>
                    )}
                  </Badge>
                ))}
                {isEditing && (
                  <div className="flex items-center gap-1">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add tag..."
                      className="w-24 h-6 text-xs"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    />
                    <Button size="sm" onClick={handleAddTag} className="h-6 px-2">
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Checklist */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Checklist</label>
              {totalChecklistItems > 0 && (
                <span className="text-xs text-gray-500">
                  {completedChecklistItems}/{totalChecklistItems} completed ({Math.round(checklistProgress)}%)
                </span>
              )}
            </div>
            
            {totalChecklistItems > 0 && (
              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${checklistProgress}%` }}
                />
              </div>
            )}

            <div className="space-y-2">
              {editingTask.checklist.map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleChecklistItem(item.id)}
                    className="hover:scale-110 transition-transform"
                  >
                    <CheckSquare className={`w-4 h-4 ${
                      item.completed ? 'text-green-500' : 'text-gray-400'
                    }`} />
                  </button>
                  <span className={`text-sm ${item.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                    {item.text}
                  </span>
                </div>
              ))}
              
              {isEditing && (
                <div className="flex items-center gap-2 mt-2">
                  <Input
                    value={newChecklistItem}
                    onChange={(e) => setNewChecklistItem(e.target.value)}
                    placeholder="Add checklist item..."
                    className="text-sm"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddChecklistItem()}
                  />
                  <Button size="sm" onClick={handleAddChecklistItem}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="flex items-center gap-4 text-xs text-gray-500 pt-4 border-t">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Created {new Date(editingTask.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Updated {new Date(editingTask.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
