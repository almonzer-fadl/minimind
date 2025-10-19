"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Calendar,
  Tag,
  Star,
  Edit,
  Save,
  X,
  Plus,
  Trash2
} from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  isStarred: boolean;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
  wordCount: number;
}

interface NoteDetailProps {
  note: Note;
  onBack: () => void;
  onUpdate: (updatedNote: Note) => void;
  onDelete: (noteId: string) => void;
}

export default function NoteDetail({ note, onBack, onUpdate, onDelete }: NoteDetailProps) {
  const [editingNote, setEditingNote] = useState<Note>(note);
  const [isEditing, setIsEditing] = useState(false);
  const [newTag, setNewTag] = useState('');

  const handleUpdateNote = () => {
    const wordCount = editingNote.content.trim().split(/\s+/).filter(word => word.length > 0).length;
    const updatedNote = {
      ...editingNote,
      wordCount,
      updatedAt: new Date().toISOString()
    };
    onUpdate(updatedNote);
    setIsEditing(false);
  };

  const handleAddTag = () => {
    if (!newTag.trim() || editingNote.tags.includes(newTag.trim())) return;

    setEditingNote(prev => ({
      ...prev,
      tags: [...prev.tags, newTag.trim()]
    }));

    setNewTag('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setEditingNote(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleStarNote = () => {
    setEditingNote(prev => ({
      ...prev,
      isStarred: !prev.isStarred
    }));
  };

  const handlePinNote = () => {
    setEditingNote(prev => ({
      ...prev,
      isPinned: !prev.isPinned
    }));
  };

  const handleDeleteNote = () => {
    if (confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
      onDelete(note.id);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const currentWordCount = editingNote.content.trim().split(/\s+/).filter(word => word.length > 0).length;
  const currentCharCount = editingNote.content.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Notes
        </Button>
      </div>

      {/* Note Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {isEditing ? (
                <Input
                  value={editingNote.title}
                  onChange={(e) => setEditingNote(prev => ({ ...prev, title: e.target.value }))}
                  className="text-2xl font-bold border-none p-0 h-auto mb-2"
                  placeholder="Note title..."
                />
              ) : (
                <CardTitle className="text-2xl flex items-center gap-2">
                  {editingNote.title}
                  {editingNote.isPinned && (
                    <Badge variant="secondary" className="text-xs">Pinned</Badge>
                  )}
                </CardTitle>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleStarNote}
                className={editingNote.isStarred ? 'text-yellow-400' : 'text-gray-400'}
              >
                <Star className={`w-4 h-4 ${editingNote.isStarred ? 'fill-current' : ''}`} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePinNote}
                className={editingNote.isPinned ? 'text-blue-400' : 'text-gray-400'}
              >
                📌
              </Button>
              {isEditing ? (
                <>
                  <Button size="sm" onClick={handleUpdateNote}>
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button size="sm" onClick={() => setIsEditing(true)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDeleteNote} className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Created {formatDate(editingNote.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Updated {formatDate(editingNote.updatedAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>{currentWordCount} words • {currentCharCount} characters</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Content */}
          <div>
            <label className="text-sm font-medium text-gray-700">Content</label>
            {isEditing ? (
              <Textarea
                value={editingNote.content}
                onChange={(e) => setEditingNote(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Write your note here..."
                className="mt-1 min-h-[400px] resize-none"
              />
            ) : (
              <div className="mt-1 p-4 bg-gray-50 rounded-lg min-h-[400px]">
                <pre className="whitespace-pre-wrap font-sans text-gray-900">
                  {editingNote.content || 'No content yet...'}
                </pre>
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="text-sm font-medium text-gray-700">Tags</label>
            <div className="flex items-center gap-2 mt-1">
              <Tag className="w-4 h-4 text-gray-400" />
              <div className="flex flex-wrap gap-2 flex-1">
                {editingNote.tags.map((tag, index) => (
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

          {/* Quick Actions */}
          {!isEditing && (
            <div className="flex items-center gap-2 pt-4 border-t">
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Note
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleStarNote}
                className={editingNote.isStarred ? 'text-yellow-600 border-yellow-300' : ''}
              >
                <Star className={`w-4 h-4 mr-2 ${editingNote.isStarred ? 'fill-current' : ''}`} />
                {editingNote.isStarred ? 'Unstar' : 'Star'}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handlePinNote}
                className={editingNote.isPinned ? 'text-blue-600 border-blue-300' : ''}
              >
                📌 {editingNote.isPinned ? 'Unpin' : 'Pin'}
              </Button>
            </div>
          )}

          {/* Editing Actions */}
          {isEditing && (
            <div className="flex items-center gap-2 pt-4 border-t">
              <Button onClick={handleUpdateNote}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <div className="text-sm text-gray-500 ml-auto">
                {currentWordCount} words • {currentCharCount} characters
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
