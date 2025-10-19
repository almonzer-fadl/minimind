"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  MoreHorizontal,
  Calendar,
  Paperclip,
  MessageSquare,
  CheckSquare,
  ArrowLeft
} from 'lucide-react';

interface Card {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  assignee?: string;
  tags: string[];
  attachments: number;
  comments: number;
  checklist: { completed: number; total: number };
  createdAt: string;
  updatedAt: string;
}

interface List {
  id: string;
  title: string;
  cards: Card[];
  createdAt: string;
}

interface Board {
  id: string;
  title: string;
  description: string;
  lists: List[];
  createdAt: string;
  updatedAt: string;
}

interface BoardDetailProps {
  board: Board;
  onBack: () => void;
}

export default function BoardDetail({ board, onBack }: BoardDetailProps) {
  const [lists, setLists] = useState<List[]>(board.lists);
  const [showAddList, setShowAddList] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');
  const [showAddCard, setShowAddCard] = useState<string | null>(null);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardDescription, setNewCardDescription] = useState('');

  const handleCreateList = async () => {
    if (!newListTitle.trim()) return;

    const newList: List = {
      id: Date.now().toString(),
      title: newListTitle,
      cards: [],
      createdAt: new Date().toISOString()
    };

    setLists(prev => [...prev, newList]);
    setNewListTitle('');
    setShowAddList(false);
  };

  const handleCreateCard = async (listId: string) => {
    if (!newCardTitle.trim()) return;

    const newCard: Card = {
      id: Date.now().toString(),
      title: newCardTitle,
      description: newCardDescription,
      tags: [],
      attachments: 0,
      comments: 0,
      checklist: { completed: 0, total: 0 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setLists(prev => prev.map(list => 
      list.id === listId 
        ? { ...list, cards: [...list.cards, newCard] }
        : list
    ));

    setNewCardTitle('');
    setNewCardDescription('');
    setShowAddCard(null);
  };

  // Note: handleMoveCard and formatDate are ready for future drag-and-drop functionality
  // const handleMoveCard = (cardId: string, fromListId: string, toListId: string) => { ... };
  // const formatDate = (dateString: string) => { ... };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Boards
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{board.title}</h1>
          <p className="text-gray-600">{board.description}</p>
        </div>
      </div>

      {/* Lists Container */}
      <div className="flex gap-6 overflow-x-auto pb-4">
        {lists.map((list) => (
          <div key={list.id} className="flex-shrink-0 w-80">
            <Card className="h-fit">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{list.title}</CardTitle>
                  <div className="flex items-center gap-1">
                    <Badge variant="secondary">{list.cards.length}</Badge>
                    <Button variant="ghost" size="sm" className="p-1 h-auto">
                      <MoreHorizontal className="w-4 h-4 text-gray-400" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                {/* Cards */}
                {list.cards.map((card) => (
                  <Card key={card.id} className="p-3 hover:shadow-sm transition-shadow cursor-pointer">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm text-gray-900">{card.title}</h4>
                      
                      {card.description && (
                        <p className="text-xs text-gray-600 line-clamp-2">{card.description}</p>
                      )}
                      
                      {/* Tags */}
                      {card.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {card.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      {/* Card Footer */}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-3">
                          {card.checklist.total > 0 && (
                            <div className="flex items-center gap-1">
                              <CheckSquare className="w-3 h-3" />
                              <span>{card.checklist.completed}/{card.checklist.total}</span>
                            </div>
                          )}
                          {card.attachments > 0 && (
                            <div className="flex items-center gap-1">
                              <Paperclip className="w-3 h-3" />
                              <span>{card.attachments}</span>
                            </div>
                          )}
                          {card.comments > 0 && (
                            <div className="flex items-center gap-1">
                              <MessageSquare className="w-3 h-3" />
                              <span>{card.comments}</span>
                            </div>
                          )}
                        </div>
                        
                        {card.dueDate && (
                          <div className={`flex items-center gap-1 ${
                            isOverdue(card.dueDate) ? 'text-red-600' : 'text-gray-500'
                          }`}>
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(card.dueDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}

                {/* Add Card Button */}
                {showAddCard === list.id ? (
                  <Card className="p-3 border-2 border-dashed border-gray-300">
                    <div className="space-y-3">
                      <Input
                        placeholder="Enter card title..."
                        value={newCardTitle}
                        onChange={(e) => setNewCardTitle(e.target.value)}
                        className="text-sm"
                      />
                      <Textarea
                        placeholder="Add description..."
                        value={newCardDescription}
                        onChange={(e) => setNewCardDescription(e.target.value)}
                        className="text-sm min-h-[60px]"
                      />
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleCreateCard(list.id)}
                          disabled={!newCardTitle.trim()}
                        >
                          Add Card
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setShowAddCard(null);
                            setNewCardTitle('');
                            setNewCardDescription('');
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </Card>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-gray-500 hover:text-gray-700"
                    onClick={() => setShowAddCard(list.id)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add a card
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        ))}

        {/* Add List Button */}
        {showAddList ? (
          <div className="flex-shrink-0 w-80">
            <Card className="border-2 border-dashed border-gray-300">
              <CardHeader>
                <Input
                  placeholder="Enter list title..."
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                  className="text-sm"
                />
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    onClick={handleCreateList}
                    disabled={!newListTitle.trim()}
                  >
                    Add List
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setShowAddList(false);
                      setNewListTitle('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="flex-shrink-0 w-80">
            <Card className="border-2 border-dashed border-gray-300 hover:border-gray-400">
              <CardContent className="flex items-center justify-center py-12">
                <Button
                  variant="ghost"
                  className="flex flex-col items-center gap-2 h-auto py-4"
                  onClick={() => setShowAddList(true)}
                >
                  <Plus className="w-6 h-6 text-gray-400" />
                  <span className="text-gray-500">Add another list</span>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
