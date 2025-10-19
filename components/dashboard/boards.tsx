"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { BoardListSkeleton } from '@/components/loading/board-skeleton';
import { ErrorState } from '@/components/ui/error-state';
import BoardDetail from '@/components/boards/board-detail';
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Calendar,
  Users,
  Star,
} from 'lucide-react';

interface Board {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'archived';
  isStarred: boolean;
  taskCount: number;
  completedTasks: number;
  dueDate?: string;
  color: string;
  createdAt: string;
  updatedAt: string;
  lists?: { id: string; title: string; cards: { id: string; title: string; description?: string }[]; createdAt: string }[]; // Will be populated when viewing board detail
}

interface BoardsProps {
  triggerCreate?: boolean;
}

export default function Boards({ triggerCreate = false }: BoardsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [newBoardDescription, setNewBoardDescription] = useState('');
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);

  // Start with empty array - data will be loaded from localStorage or API
  const [boards, setBoards] = useState<Board[]>([]);

  // Trigger create form when requested from sidebar
  useEffect(() => {
    if (triggerCreate) {
      setShowCreateForm(true);
    }
  }, [triggerCreate]);

  const handleCreateBoard = async () => {
    if (!newBoardTitle.trim()) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newBoard: Board = {
        id: Date.now().toString(),
        title: newBoardTitle,
        description: newBoardDescription,
        status: 'active',
        isStarred: false,
        taskCount: 0,
        completedTasks: 0,
        color: 'blue',
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };

      setBoards(prev => [newBoard, ...prev]);
      setNewBoardTitle('');
      setNewBoardDescription('');
      setShowCreateForm(false);
      
      // Save to localStorage and trigger update
      const updatedBoards = [newBoard, ...boards];
      localStorage.setItem('boards', JSON.stringify(updatedBoards));
      window.dispatchEvent(new CustomEvent('dataUpdated'));
    } catch {
      setError('Failed to create board');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStarBoard = (boardId: string) => {
    setBoards(prev => prev.map(board => 
      board.id === boardId 
        ? { ...board, isStarred: !board.isStarred }
        : board
    ));
  };


  const filteredBoards = boards.filter(board => 
    board.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    board.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getProgressPercentage = (completed: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500',
      red: 'bg-red-500',
      yellow: 'bg-yellow-500'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  // If a board is selected, show the board detail view
  if (selectedBoard) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return <BoardDetail board={selectedBoard as any} onBack={() => setSelectedBoard(null)} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Boards</h2>
          <p className="text-gray-600 mt-1">Organize your projects and track progress</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Board
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search boards..."
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

      {/* Create Board Form */}
      {showCreateForm && (
        <Card className="border-2 border-dashed border-gray-300">
          <CardHeader>
            <CardTitle>Create New Board</CardTitle>
            <CardDescription>Set up a new project board to organize your work</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Board Title</label>
              <Input
                placeholder="Enter board title..."
                value={newBoardTitle}
                onChange={(e) => setNewBoardTitle(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Description (Optional)</label>
              <Input
                placeholder="Enter board description..."
                value={newBoardDescription}
                onChange={(e) => setNewBoardDescription(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={handleCreateBoard} disabled={isLoading || !newBoardTitle.trim()}>
                {isLoading ? 'Creating...' : 'Create Board'}
              </Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Boards Grid */}
      {isLoading && boards.length === 0 ? (
        <BoardListSkeleton />
      ) : error ? (
        <ErrorState
          title="Failed to load boards"
          description="There was an error loading your boards."
          error={error}
          onRetry={() => {
            setError(null);
            setIsLoading(true);
            setTimeout(() => setIsLoading(false), 1000);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBoards.map((board) => (
            <Card key={board.id} className="hover:shadow-md transition-shadow cursor-pointer group" onClick={() => setSelectedBoard(board)}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getColorClasses(board.color)}`} />
                    <CardTitle className="text-lg">{board.title}</CardTitle>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 h-auto"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStarBoard(board.id);
                      }}
                    >
                      <Star className={`w-4 h-4 ${board.isStarred ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
                    </Button>
                    <Button variant="ghost" size="sm" className="p-1 h-auto">
                      <MoreHorizontal className="w-4 h-4 text-gray-400" />
                    </Button>
                  </div>
                </div>
                <CardDescription className="line-clamp-2">{board.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-3">
                {/* Progress Bar */}
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className="text-gray-900 font-medium">
                      {board.completedTasks}/{board.taskCount} tasks
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getColorClasses(board.color)}`}
                      style={{ width: `${getProgressPercentage(board.completedTasks, board.taskCount)}%` }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>Team</span>
                    </div>
                    {board.dueDate && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Due: {new Date(board.dueDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                  <Badge variant={board.status === 'active' ? 'default' : 'secondary'}>
                    {board.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Create New Board Card */}
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed border-2 border-gray-300 hover:border-gray-400">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Plus className="w-8 h-8 text-gray-400 mb-4" />
              <p className="text-gray-500 font-medium">Create new board</p>
              <p className="text-gray-400 text-sm mt-1">Click to start organizing</p>
            </CardContent>
          </Card>
        </div>
      )}

      {filteredBoards.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <p className="text-gray-500">No boards found matching &quot;{searchTerm}&quot;</p>
          <Button variant="outline" className="mt-4" onClick={() => setSearchTerm('')}>
            Clear search
          </Button>
        </div>
      )}
    </div>
  );
}
