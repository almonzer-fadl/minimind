import Dexie, { Table } from 'dexie';

// Define the structure of our offline data
export interface OfflineBoard {
  id: string;
  userId: string;
  nameEncrypted: string;
  descriptionEncrypted?: string;
  position: number;
  createdAt: Date;
  updatedAt: Date;
  syncStatus: 'synced' | 'pending' | 'conflict' | 'error';
  lastSyncAt?: Date;
}

export interface OfflineList {
  id: string;
  boardId: string;
  nameEncrypted: string;
  position: number;
  createdAt: Date;
  updatedAt: Date;
  syncStatus: 'synced' | 'pending' | 'conflict' | 'error';
  lastSyncAt?: Date;
}

export interface OfflineCard {
  id: string;
  listId: string;
  titleEncrypted: string;
  descriptionEncrypted?: string;
  position: number;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  syncStatus: 'synced' | 'pending' | 'conflict' | 'error';
  lastSyncAt?: Date;
}

export interface OfflineTask {
  id: string;
  userId: string;
  titleEncrypted: string;
  descriptionEncrypted?: string;
  completed: boolean;
  priority: number;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  syncStatus: 'synced' | 'pending' | 'conflict' | 'error';
  lastSyncAt?: Date;
}

export interface OfflineNote {
  id: string;
  userId: string;
  titleEncrypted: string;
  contentEncrypted: string;
  tagsEncrypted?: string;
  createdAt: Date;
  updatedAt: Date;
  syncStatus: 'synced' | 'pending' | 'conflict' | 'error';
  lastSyncAt?: Date;
}

export interface SyncOperation {
  id: string;
  userId: string;
  operation: 'create' | 'update' | 'delete';
  tableName: string;
  recordId: string;
  data: any;
  timestamp: Date;
  retryCount: number;
  status: 'pending' | 'synced' | 'failed';
}

// Define the database
export class OfflineDatabase extends Dexie {
  boards!: Table<OfflineBoard>;
  lists!: Table<OfflineList>;
  cards!: Table<OfflineCard>;
  tasks!: Table<OfflineTask>;
  notes!: Table<OfflineNote>;
  syncOperations!: Table<SyncOperation>;

  constructor() {
    super('MinimindOfflineDB');
    
    this.version(1).stores({
      boards: 'id, userId, position, syncStatus, lastSyncAt',
      lists: 'id, boardId, position, syncStatus, lastSyncAt',
      cards: 'id, listId, position, syncStatus, lastSyncAt',
      tasks: 'id, userId, completed, priority, syncStatus, lastSyncAt',
      notes: 'id, userId, syncStatus, lastSyncAt',
      syncOperations: 'id, userId, operation, tableName, recordId, timestamp, status',
    });

    // Add indexes for better performance
    this.version(2).stores({
      boards: 'id, userId, position, syncStatus, lastSyncAt, createdAt',
      lists: 'id, boardId, position, syncStatus, lastSyncAt, createdAt',
      cards: 'id, listId, position, syncStatus, lastSyncAt, createdAt',
      tasks: 'id, userId, completed, priority, syncStatus, lastSyncAt, createdAt',
      notes: 'id, userId, syncStatus, lastSyncAt, createdAt',
      syncOperations: 'id, userId, operation, tableName, recordId, timestamp, status, retryCount',
    });
  }
}

// Create a singleton instance
export const offlineDb = new OfflineDatabase();

// Utility functions for offline operations
export class OfflineOperations {
  // Board operations
  static async createBoard(board: Omit<OfflineBoard, 'id' | 'syncStatus' | 'lastSyncAt'>) {
    const newBoard: OfflineBoard = {
      ...board,
      id: crypto.randomUUID(),
      syncStatus: 'pending',
    };
    
    await offlineDb.boards.add(newBoard);
    await this.queueSyncOperation('create', 'boards', newBoard.id, newBoard);
    
    return newBoard;
  }

  static async updateBoard(id: string, updates: Partial<OfflineBoard>) {
    await offlineDb.boards.update(id, {
      ...updates,
      syncStatus: 'pending',
      updatedAt: new Date(),
    });
    
    const board = await offlineDb.boards.get(id);
    if (board) {
      await this.queueSyncOperation('update', 'boards', id, board);
    }
  }

  static async deleteBoard(id: string) {
    await offlineDb.boards.delete(id);
    await this.queueSyncOperation('delete', 'boards', id, null);
  }

  // List operations
  static async createList(list: Omit<OfflineList, 'id' | 'syncStatus' | 'lastSyncAt'>) {
    const newList: OfflineList = {
      ...list,
      id: crypto.randomUUID(),
      syncStatus: 'pending',
    };
    
    await offlineDb.lists.add(newList);
    await this.queueSyncOperation('create', 'lists', newList.id, newList);
    
    return newList;
  }

  static async updateList(id: string, updates: Partial<OfflineList>) {
    await offlineDb.lists.update(id, {
      ...updates,
      syncStatus: 'pending',
      updatedAt: new Date(),
    });
    
    const list = await offlineDb.lists.get(id);
    if (list) {
      await this.queueSyncOperation('update', 'lists', id, list);
    }
  }

  static async deleteList(id: string) {
    await offlineDb.lists.delete(id);
    await this.queueSyncOperation('delete', 'lists', id, null);
  }

  // Card operations
  static async createCard(card: Omit<OfflineCard, 'id' | 'syncStatus' | 'lastSyncAt'>) {
    const newCard: OfflineCard = {
      ...card,
      id: crypto.randomUUID(),
      syncStatus: 'pending',
    };
    
    await offlineDb.cards.add(newCard);
    await this.queueSyncOperation('create', 'cards', newCard.id, newCard);
    
    return newCard;
  }

  static async updateCard(id: string, updates: Partial<OfflineCard>) {
    await offlineDb.cards.update(id, {
      ...updates,
      syncStatus: 'pending',
      updatedAt: new Date(),
    });
    
    const card = await offlineDb.cards.get(id);
    if (card) {
      await this.queueSyncOperation('update', 'cards', id, card);
    }
  }

  static async deleteCard(id: string) {
    await offlineDb.cards.delete(id);
    await this.queueSyncOperation('delete', 'cards', id, null);
  }

  // Task operations
  static async createTask(task: Omit<OfflineTask, 'id' | 'syncStatus' | 'lastSyncAt'>) {
    const newTask: OfflineTask = {
      ...task,
      id: crypto.randomUUID(),
      syncStatus: 'pending',
    };
    
    await offlineDb.tasks.add(newTask);
    await this.queueSyncOperation('create', 'tasks', newTask.id, newTask);
    
    return newTask;
  }

  static async updateTask(id: string, updates: Partial<OfflineTask>) {
    await offlineDb.tasks.update(id, {
      ...updates,
      syncStatus: 'pending',
      updatedAt: new Date(),
    });
    
    const task = await offlineDb.tasks.get(id);
    if (task) {
      await this.queueSyncOperation('update', 'tasks', id, task);
    }
  }

  static async deleteTask(id: string) {
    await offlineDb.tasks.delete(id);
    await this.queueSyncOperation('delete', 'tasks', id, null);
  }

  // Note operations
  static async createNote(note: Omit<OfflineNote, 'id' | 'syncStatus' | 'lastSyncAt'>) {
    const newNote: OfflineNote = {
      ...note,
      id: crypto.randomUUID(),
      syncStatus: 'pending',
    };
    
    await offlineDb.notes.add(newNote);
    await this.queueSyncOperation('create', 'notes', newNote.id, newNote);
    
    return newNote;
  }

  static async updateNote(id: string, updates: Partial<OfflineNote>) {
    await offlineDb.notes.update(id, {
      ...updates,
      syncStatus: 'pending',
      updatedAt: new Date(),
    });
    
    const note = await offlineDb.notes.get(id);
    if (note) {
      await this.queueSyncOperation('update', 'notes', id, note);
    }
  }

  static async deleteNote(id: string) {
    await offlineDb.notes.delete(id);
    await this.queueSyncOperation('delete', 'notes', id, null);
  }

  // Sync queue operations
  static async queueSyncOperation(
    operation: 'create' | 'update' | 'delete',
    tableName: string,
    recordId: string,
    data: any
  ) {
    const syncOp: SyncOperation = {
      id: crypto.randomUUID(),
      userId: 'current-user', // This should be set from the auth context
      operation,
      tableName,
      recordId,
      data,
      timestamp: new Date(),
      retryCount: 0,
      status: 'pending',
    };
    
    await offlineDb.syncOperations.add(syncOp);
  }

  static async getPendingSyncOperations(): Promise<SyncOperation[]> {
    return await offlineDb.syncOperations
      .where('status')
      .equals('pending')
      .toArray()
      .then(operations => operations.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()));
  }

  static async markSyncOperationComplete(id: string) {
    await offlineDb.syncOperations.update(id, {
      status: 'synced',
    });
  }

  static async markSyncOperationFailed(id: string, retryCount: number) {
    await offlineDb.syncOperations.update(id, {
      status: 'failed',
      retryCount,
    });
  }

  // Get data for specific user
  static async getUserBoards(userId: string): Promise<OfflineBoard[]> {
    return await offlineDb.boards.where('userId').equals(userId).toArray();
  }

  static async getUserTasks(userId: string): Promise<OfflineTask[]> {
    return await offlineDb.tasks.where('userId').equals(userId).toArray();
  }

  static async getUserNotes(userId: string): Promise<OfflineNote[]> {
    return await offlineDb.notes.where('userId').equals(userId).toArray();
  }

  static async getBoardLists(boardId: string): Promise<OfflineList[]> {
    return await offlineDb.lists.where('boardId').equals(boardId).toArray();
  }

  static async getListCards(listId: string): Promise<OfflineCard[]> {
    return await offlineDb.cards.where('listId').equals(listId).toArray();
  }
}
