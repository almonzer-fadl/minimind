"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  X, 
  Archive, 
  RotateCcw,
  Trash2,
  Search,
  Calendar,
  FileText,
  CheckSquare,
  Clock,
} from 'lucide-react';

interface ArchivedItem {
  id: string;
  type: 'board' | 'task' | 'note';
  title: string;
  description?: string;
  archivedAt: string;
  originalData: unknown;
}

interface ArchiveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ArchiveModal({ isOpen, onClose }: ArchiveModalProps) {
  const [archivedItems, setArchivedItems] = useState<ArchivedItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'board' | 'task' | 'note'>('all');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  useEffect(() => {
    loadArchivedItems();
  }, []);

  const loadArchivedItems = () => {
    const archived = localStorage.getItem('archivedItems');
    if (archived) {
      setArchivedItems(JSON.parse(archived));
    }
  };

  const restoreItem = (id: string) => {
    const item = archivedItems.find(i => i.id === id);
    if (!item) return;

    const { type, originalData } = item;
    
    // Restore to appropriate localStorage key
    switch (type) {
      case 'board':
        const boards = JSON.parse(localStorage.getItem('boards') || '[]');
        boards.push(originalData);
        localStorage.setItem('boards', JSON.stringify(boards));
        break;
      case 'task':
        const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        tasks.push(originalData);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        break;
      case 'note':
        const notes = JSON.parse(localStorage.getItem('notes') || '[]');
        notes.push(originalData);
        localStorage.setItem('notes', JSON.stringify(notes));
        break;
    }

    // Remove from archive
    const updated = archivedItems.filter(i => i.id !== id);
    setArchivedItems(updated);
    localStorage.setItem('archivedItems', JSON.stringify(updated));
    
    // Trigger data update event
    window.dispatchEvent(new CustomEvent('dataUpdated'));
    
    alert(`${type} restored successfully!`);
  };

  const restoreSelectedItems = () => {
    if (selectedItems.length === 0) return;
    
    selectedItems.forEach(id => {
      restoreItem(id);
    });
    
    setSelectedItems([]);
  };

  const permanentlyDeleteItem = (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this item? This action cannot be undone.')) {
      return;
    }

    const updated = archivedItems.filter(i => i.id !== id);
    setArchivedItems(updated);
    localStorage.setItem('archivedItems', JSON.stringify(updated));
  };

  const permanentlyDeleteSelected = () => {
    if (selectedItems.length === 0) return;
    
    if (!confirm(`Are you sure you want to permanently delete ${selectedItems.length} item(s)? This action cannot be undone.`)) {
      return;
    }

    const updated = archivedItems.filter(i => !selectedItems.includes(i.id));
    setArchivedItems(updated);
    localStorage.setItem('archivedItems', JSON.stringify(updated));
    setSelectedItems([]);
  };

  const clearAllArchived = () => {
    if (!confirm('Are you sure you want to permanently delete all archived items? This action cannot be undone.')) {
      return;
    }

    setArchivedItems([]);
    localStorage.removeItem('archivedItems');
    setSelectedItems([]);
  };

  const toggleItemSelection = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    const filtered = getFilteredItems();
    if (selectedItems.length === filtered.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filtered.map(item => item.id));
    }
  };

  const getFilteredItems = () => {
    return archivedItems.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesType = filterType === 'all' || item.type === filterType;
      return matchesSearch && matchesType;
    });
  };

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'board': return <Calendar className="w-4 h-4" />;
      case 'task': return <CheckSquare className="w-4 h-4" />;
      case 'note': return <FileText className="w-4 h-4" />;
      default: return <Archive className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredItems = getFilteredItems();
  const allSelected = filteredItems.length > 0 && selectedItems.length === filteredItems.length;
  const someSelected = selectedItems.length > 0 && selectedItems.length < filteredItems.length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <Archive className="w-6 h-6 text-orange-600" />
            <h2 className="text-xl font-semibold text-gray-900">Archive</h2>
            <Badge variant="secondary" className="ml-2">
              {archivedItems.length} items
            </Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="p-4 border-b bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search archived items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as typeof filterType)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Types</option>
                <option value="board">Boards</option>
                <option value="task">Tasks</option>
                <option value="note">Notes</option>
              </select>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={allSelected}
              ref={(input) => {
                if (input) input.indeterminate = someSelected;
              }}
              onChange={toggleSelectAll}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <span className="text-sm text-gray-600">
              {selectedItems.length > 0 
                ? `${selectedItems.length} selected`
                : 'Select items'
              }
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={restoreSelectedItems}
              disabled={selectedItems.length === 0}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Restore Selected
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={permanentlyDeleteSelected}
              disabled={selectedItems.length === 0}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Selected
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={clearAllArchived}
              disabled={archivedItems.length === 0}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          </div>
        </div>

        {/* Archived Items List */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <Archive className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {archivedItems.length === 0 ? 'No archived items' : 'No items found'}
              </h3>
              <p className="text-gray-500">
                {archivedItems.length === 0 
                  ? 'Items you delete will appear here' 
                  : 'Try adjusting your search or filters'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredItems.map((item) => (
                <Card key={item.id} className="transition-all hover:shadow-md">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleItemSelection(item.id)}
                        className="w-4 h-4 text-blue-600 rounded mt-1"
                      />
                      <div className={`p-2 rounded-full bg-orange-100 text-orange-600`}>
                        {getItemIcon(item.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">
                              {item.title}
                            </h4>
                            {item.description && (
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {item.description}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              <Clock className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-500">
                                Archived on {formatDate(item.archivedAt)}
                              </span>
                              <Badge variant="secondary" className="text-xs">
                                {item.type}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => restoreItem(item.id)}
                              className="text-green-600 hover:text-green-700"
                            >
                              <RotateCcw className="w-4 h-4 mr-1" />
                              Restore
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => permanentlyDeleteItem(item.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="border-t p-4 bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            Archived items are stored locally and can be restored or permanently deleted.
            {archivedItems.length > 0 && (
              <span className="block mt-1">
                Total archived items: {archivedItems.length}
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
