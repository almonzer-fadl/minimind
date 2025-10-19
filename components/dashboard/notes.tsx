"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { NoteListSkeleton } from '@/components/loading/note-skeleton';
import { ErrorState } from '@/components/ui/error-state';
import NoteDetail from '@/components/notes/note-detail';
import {
  Plus,
  Search,
  Filter,
  Calendar,
  Star,
  MoreHorizontal,
  Tag
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

interface NotesProps {
  triggerCreate?: boolean;
}

export default function Notes({ triggerCreate = false }: NotesProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteTags, setNewNoteTags] = useState('');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  // Start with empty array - data will be loaded from localStorage or API
  const [notes, setNotes] = useState<Note[]>([]);

  // Trigger create form when requested from sidebar
  useEffect(() => {
    if (triggerCreate) {
      setShowCreateForm(true);
    }
  }, [triggerCreate]);

  const handleCreateNote = async () => {
    if (!newNoteTitle.trim()) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const tags = newNoteTags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      const wordCount = newNoteContent.trim().split(/\s+/).filter(word => word.length > 0).length;
      
      const newNote: Note = {
        id: Date.now().toString(),
        title: newNoteTitle,
        content: newNoteContent,
        tags,
        isStarred: false,
        isPinned: false,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        wordCount
      };

      setNotes(prev => [newNote, ...prev]);
      setNewNoteTitle('');
      setNewNoteContent('');
      setNewNoteTags('');
      setShowCreateForm(false);
      
      // Save to localStorage and trigger update
      const updatedNotes = [newNote, ...notes];
      localStorage.setItem('notes', JSON.stringify(updatedNotes));
      window.dispatchEvent(new CustomEvent('dataUpdated'));
    } catch {
      setError('Failed to create note');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStarNote = (noteId: string) => {
    setNotes(prev => prev.map(note => 
      note.id === noteId 
        ? { ...note, isStarred: !note.isStarred }
        : note
    ));
  };


  const allTags = Array.from(new Set(notes.flatMap(note => note.tags)));
  
  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTag = !selectedTag || note.tags.includes(selectedTag);
    
    return matchesSearch && matchesTag;
  });

  // Sort notes: pinned first, then starred, then by updated date
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    if (a.isStarred && !b.isStarred) return -1;
    if (!a.isStarred && b.isStarred) return 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  const handleUpdateNote = (updatedNote: Note) => {
    setNotes(prev => prev.map(note => 
      note.id === updatedNote.id ? updatedNote : note
    ));
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
    setSelectedNote(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  // If a note is selected, show the note detail view
  if (selectedNote) {
    return <NoteDetail note={selectedNote} onBack={() => setSelectedNote(null)} onUpdate={handleUpdateNote} onDelete={handleDeleteNote} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notes</h2>
          <p className="text-gray-600 mt-1">Capture ideas and thoughts instantly</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Note
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant={selectedTag === null ? "default" : "outline"} 
            size="sm"
            onClick={() => setSelectedTag(null)}
          >
            All
          </Button>
          {allTags.slice(0, 5).map(tag => (
            <Button
              key={tag}
              variant={selectedTag === tag ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
            >
              {tag}
            </Button>
          ))}
        </div>
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Create Note Form */}
      {showCreateForm && (
        <Card className="border-2 border-dashed border-gray-300">
          <CardHeader>
            <CardTitle>Create New Note</CardTitle>
            <CardDescription>Capture your thoughts and ideas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Note Title</label>
              <Input
                placeholder="Enter note title..."
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Content</label>
              <Textarea
                placeholder="Write your note here..."
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                className="mt-1 min-h-[120px]"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Tags (comma-separated)</label>
              <Input
                placeholder="tag1, tag2, tag3..."
                value={newNoteTags}
                onChange={(e) => setNewNoteTags(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={handleCreateNote} disabled={isLoading || !newNoteTitle.trim()}>
                {isLoading ? 'Creating...' : 'Create Note'}
              </Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notes Grid */}
      {isLoading && notes.length === 0 ? (
        <NoteListSkeleton />
      ) : error ? (
        <ErrorState
          title="Failed to load notes"
          description="There was an error loading your notes."
          error={error}
          onRetry={() => {
            setError(null);
            setIsLoading(true);
            setTimeout(() => setIsLoading(false), 1000);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedNotes.map((note) => (
            <Card key={note.id} className="hover:shadow-md transition-shadow cursor-pointer group" onClick={() => setSelectedNote(note)}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {note.isPinned && <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />}
                    <CardTitle className="text-lg line-clamp-2">{note.title}</CardTitle>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 h-auto"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStarNote(note.id);
                      }}
                    >
                      <Star className={`w-4 h-4 ${note.isStarred ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
                    </Button>
                    <Button variant="ghost" size="sm" className="p-1 h-auto">
                      <MoreHorizontal className="w-4 h-4 text-gray-400" />
                    </Button>
                  </div>
                </div>
                <CardDescription className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(note.updatedAt)}</span>
                  <span className="text-gray-400">•</span>
                  <span>{note.wordCount} words</span>
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                  {note.content}
                </p>
                <div className="flex flex-wrap gap-2">
                  {note.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Create New Note Card */}
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed border-2 border-gray-300 hover:border-gray-400">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Plus className="w-8 h-8 text-gray-400 mb-4" />
              <p className="text-gray-500 font-medium">Create new note</p>
              <p className="text-gray-400 text-sm mt-1">Capture your thoughts</p>
            </CardContent>
          </Card>
        </div>
      )}

      {sortedNotes.length === 0 && (searchTerm || selectedTag) && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No notes found matching &quot;{searchTerm}&quot; {selectedTag && `with tag &quot;${selectedTag}&quot;`}
          </p>
          <Button variant="outline" className="mt-4" onClick={() => {
            setSearchTerm('');
            setSelectedTag(null);
          }}>
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}
