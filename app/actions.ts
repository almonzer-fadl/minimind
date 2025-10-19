"use server";

import { neon } from "@neondatabase/serverless";
import { db } from "@/lib/db";
import { users, boards, lists, cards, tasks, notes, syncQueue } from "@/lib/db/schema";
import { eq, desc, asc } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { hashPassword, verifyPassword, encryptUserData, decryptUserData } from "@/lib/encryption/crypto";

// Database connection
const sql = neon(process.env.DATABASE_URL!);

// User Actions
export async function createUser(email: string, password: string) {
  try {
    const hashedPassword = await hashPassword(password);
    const encryptionKey = crypto.randomUUID(); // This will be derived from password in real implementation
    const encryptionKeyHash = await hashPassword(encryptionKey);
    
    const newUser = await db.insert(users).values({
      email,
      passwordHash: hashedPassword,
      encryptionKeyHash,
    }).returning();
    
    return { success: true, user: newUser[0] };
  } catch (error) {
    console.error('Error creating user:', error);
    return { success: false, error: 'Failed to create user' };
  }
}

export async function verifyUser(email: string, password: string) {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email)
    });
    
    if (!user) {
      return { success: false, error: 'User not found' };
    }
    
    const isValid = await verifyPassword(password, user.passwordHash);
    
    if (!isValid) {
      return { success: false, error: 'Invalid password' };
    }
    
    return { success: true, user };
  } catch (error) {
    console.error('Error verifying user:', error);
    return { success: false, error: 'Authentication failed' };
  }
}

// Board Actions
export async function getBoards(userId: string) {
  try {
    const userBoards = await db.query.boards.findMany({
      where: eq(boards.userId, userId),
      orderBy: asc(boards.position),
      with: {
        lists: {
          orderBy: asc(lists.position),
          with: {
            cards: {
              orderBy: asc(cards.position)
            }
          }
        }
      }
    });
    
    // Decrypt board data
    const decryptedBoards = userBoards.map(board => ({
      ...board,
      name: decryptUserData(board.nameEncrypted, 'encryption-key'), // This should use user's actual key
      description: board.descriptionEncrypted ? decryptUserData(board.descriptionEncrypted, 'encryption-key') : null,
      lists: board.lists.map(list => ({
        ...list,
        name: decryptUserData(list.nameEncrypted, 'encryption-key'),
        cards: list.cards.map(card => ({
          ...card,
          title: decryptUserData(card.titleEncrypted, 'encryption-key'),
          description: card.descriptionEncrypted ? decryptUserData(card.descriptionEncrypted, 'encryption-key') : null,
        }))
      }))
    }));
    
    return { success: true, boards: decryptedBoards };
  } catch (error) {
    console.error('Error fetching boards:', error);
    return { success: false, error: 'Failed to fetch boards' };
  }
}

export async function createBoard(userId: string, name: string, description?: string) {
  try {
    const encryptedName = encryptUserData(name, 'encryption-key'); // This should use user's actual key
    const encryptedDescription = description ? encryptUserData(description, 'encryption-key') : null;
    
    // Get the next position
    const lastBoard = await db.query.boards.findFirst({
      where: eq(boards.userId, userId),
      orderBy: desc(boards.position)
    });
    
    const position = lastBoard ? lastBoard.position + 1 : 0;
    
    const newBoard = await db.insert(boards).values({
      userId,
      nameEncrypted: encryptedName,
      descriptionEncrypted: encryptedDescription,
      position,
    }).returning();
    
    return { success: true, board: newBoard[0] };
  } catch (error) {
    console.error('Error creating board:', error);
    return { success: false, error: 'Failed to create board' };
  }
}

export async function updateBoard(boardId: string, updates: { name?: string; description?: string }) {
  try {
    const updateData: any = {};
    
    if (updates.name) {
      updateData.nameEncrypted = encryptUserData(updates.name, 'encryption-key');
    }
    if (updates.description !== undefined) {
      updateData.descriptionEncrypted = updates.description ? encryptUserData(updates.description, 'encryption-key') : null;
    }
    
    const updatedBoard = await db.update(boards)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(boards.id, boardId))
      .returning();
    
    return { success: true, board: updatedBoard[0] };
  } catch (error) {
    console.error('Error updating board:', error);
    return { success: false, error: 'Failed to update board' };
  }
}

export async function deleteBoard(boardId: string) {
  try {
    await db.delete(boards).where(eq(boards.id, boardId));
    return { success: true };
  } catch (error) {
    console.error('Error deleting board:', error);
    return { success: false, error: 'Failed to delete board' };
  }
}

// List Actions
export async function createList(boardId: string, name: string) {
  try {
    const encryptedName = encryptUserData(name, 'encryption-key');
    
    // Get the next position
    const lastList = await db.query.lists.findFirst({
      where: eq(lists.boardId, boardId),
      orderBy: desc(lists.position)
    });
    
    const position = lastList ? lastList.position + 1 : 0;
    
    const newList = await db.insert(lists).values({
      boardId,
      nameEncrypted: encryptedName,
      position,
    }).returning();
    
    return { success: true, list: newList[0] };
  } catch (error) {
    console.error('Error creating list:', error);
    return { success: false, error: 'Failed to create list' };
  }
}

export async function updateList(listId: string, name: string) {
  try {
    const encryptedName = encryptUserData(name, 'encryption-key');
    
    const updatedList = await db.update(lists)
      .set({ nameEncrypted: encryptedName, updatedAt: new Date() })
      .where(eq(lists.id, listId))
      .returning();
    
    return { success: true, list: updatedList[0] };
  } catch (error) {
    console.error('Error updating list:', error);
    return { success: false, error: 'Failed to update list' };
  }
}

export async function deleteList(listId: string) {
  try {
    await db.delete(lists).where(eq(lists.id, listId));
    return { success: true };
  } catch (error) {
    console.error('Error deleting list:', error);
    return { success: false, error: 'Failed to delete list' };
  }
}

// Card Actions
export async function createCard(listId: string, title: string, description?: string) {
  try {
    const encryptedTitle = encryptUserData(title, 'encryption-key');
    const encryptedDescription = description ? encryptUserData(description, 'encryption-key') : null;
    
    // Get the next position
    const lastCard = await db.query.cards.findFirst({
      where: eq(cards.listId, listId),
      orderBy: desc(cards.position)
    });
    
    const position = lastCard ? lastCard.position + 1 : 0;
    
    const newCard = await db.insert(cards).values({
      listId,
      titleEncrypted: encryptedTitle,
      descriptionEncrypted: encryptedDescription,
      position,
    }).returning();
    
    return { success: true, card: newCard[0] };
  } catch (error) {
    console.error('Error creating card:', error);
    return { success: false, error: 'Failed to create card' };
  }
}

export async function updateCard(cardId: string, updates: { title?: string; description?: string; dueDate?: Date }) {
  try {
    const updateData: any = { updatedAt: new Date() };
    
    if (updates.title) {
      updateData.titleEncrypted = encryptUserData(updates.title, 'encryption-key');
    }
    if (updates.description !== undefined) {
      updateData.descriptionEncrypted = updates.description ? encryptUserData(updates.description, 'encryption-key') : null;
    }
    if (updates.dueDate) {
      updateData.dueDate = updates.dueDate;
    }
    
    const updatedCard = await db.update(cards)
      .set(updateData)
      .where(eq(cards.id, cardId))
      .returning();
    
    return { success: true, card: updatedCard[0] };
  } catch (error) {
    console.error('Error updating card:', error);
    return { success: false, error: 'Failed to update card' };
  }
}

export async function deleteCard(cardId: string) {
  try {
    await db.delete(cards).where(eq(cards.id, cardId));
    return { success: true };
  } catch (error) {
    console.error('Error deleting card:', error);
    return { success: false, error: 'Failed to delete card' };
  }
}

// Task Actions
export async function getTasks(userId: string) {
  try {
    const userTasks = await db.query.tasks.findMany({
      where: eq(tasks.userId, userId),
      orderBy: desc(tasks.createdAt)
    });
    
    // Decrypt task data
    const decryptedTasks = userTasks.map(task => ({
      ...task,
      title: decryptUserData(task.titleEncrypted, 'encryption-key'),
      description: task.descriptionEncrypted ? decryptUserData(task.descriptionEncrypted, 'encryption-key') : null,
    }));
    
    return { success: true, tasks: decryptedTasks };
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return { success: false, error: 'Failed to fetch tasks' };
  }
}

export async function createTask(userId: string, title: string, description?: string, priority: number = 0) {
  try {
    const encryptedTitle = encryptUserData(title, 'encryption-key');
    const encryptedDescription = description ? encryptUserData(description, 'encryption-key') : null;
    
    const newTask = await db.insert(tasks).values({
      userId,
      titleEncrypted: encryptedTitle,
      descriptionEncrypted: encryptedDescription,
      priority,
    }).returning();
    
    return { success: true, task: newTask[0] };
  } catch (error) {
    console.error('Error creating task:', error);
    return { success: false, error: 'Failed to create task' };
  }
}

export async function updateTask(taskId: string, updates: { title?: string; description?: string; completed?: boolean; priority?: number; dueDate?: Date }) {
  try {
    const updateData: any = { updatedAt: new Date() };
    
    if (updates.title) {
      updateData.titleEncrypted = encryptUserData(updates.title, 'encryption-key');
    }
    if (updates.description !== undefined) {
      updateData.descriptionEncrypted = updates.description ? encryptUserData(updates.description, 'encryption-key') : null;
    }
    if (updates.completed !== undefined) {
      updateData.completed = updates.completed;
    }
    if (updates.priority !== undefined) {
      updateData.priority = updates.priority;
    }
    if (updates.dueDate) {
      updateData.dueDate = updates.dueDate;
    }
    
    const updatedTask = await db.update(tasks)
      .set(updateData)
      .where(eq(tasks.id, taskId))
      .returning();
    
    return { success: true, task: updatedTask[0] };
  } catch (error) {
    console.error('Error updating task:', error);
    return { success: false, error: 'Failed to update task' };
  }
}

export async function deleteTask(taskId: string) {
  try {
    await db.delete(tasks).where(eq(tasks.id, taskId));
    return { success: true };
  } catch (error) {
    console.error('Error deleting task:', error);
    return { success: false, error: 'Failed to delete task' };
  }
}

// Note Actions
export async function getNotes(userId: string) {
  try {
    const userNotes = await db.query.notes.findMany({
      where: eq(notes.userId, userId),
      orderBy: desc(notes.updatedAt)
    });
    
    // Decrypt note data
    const decryptedNotes = userNotes.map(note => ({
      ...note,
      title: decryptUserData(note.titleEncrypted, 'encryption-key'),
      content: decryptUserData(note.contentEncrypted, 'encryption-key'),
      tags: note.tagsEncrypted ? decryptUserData(note.tagsEncrypted, 'encryption-key') : null,
    }));
    
    return { success: true, notes: decryptedNotes };
  } catch (error) {
    console.error('Error fetching notes:', error);
    return { success: false, error: 'Failed to fetch notes' };
  }
}

export async function createNote(userId: string, title: string, content: string, tags?: string) {
  try {
    const encryptedTitle = encryptUserData(title, 'encryption-key');
    const encryptedContent = encryptUserData(content, 'encryption-key');
    const encryptedTags = tags ? encryptUserData(tags, 'encryption-key') : null;
    
    const newNote = await db.insert(notes).values({
      userId,
      titleEncrypted: encryptedTitle,
      contentEncrypted: encryptedContent,
      tagsEncrypted: encryptedTags,
    }).returning();
    
    return { success: true, note: newNote[0] };
  } catch (error) {
    console.error('Error creating note:', error);
    return { success: false, error: 'Failed to create note' };
  }
}

export async function updateNote(noteId: string, updates: { title?: string; content?: string; tags?: string }) {
  try {
    const updateData: any = { updatedAt: new Date() };
    
    if (updates.title) {
      updateData.titleEncrypted = encryptUserData(updates.title, 'encryption-key');
    }
    if (updates.content) {
      updateData.contentEncrypted = encryptUserData(updates.content, 'encryption-key');
    }
    if (updates.tags !== undefined) {
      updateData.tagsEncrypted = updates.tags ? encryptUserData(updates.tags, 'encryption-key') : null;
    }
    
    const updatedNote = await db.update(notes)
      .set(updateData)
      .where(eq(notes.id, noteId))
      .returning();
    
    return { success: true, note: updatedNote[0] };
  } catch (error) {
    console.error('Error updating note:', error);
    return { success: false, error: 'Failed to update note' };
  }
}

export async function deleteNote(noteId: string) {
  try {
    await db.delete(notes).where(eq(notes.id, noteId));
    return { success: true };
  } catch (error) {
    console.error('Error deleting note:', error);
    return { success: false, error: 'Failed to delete note' };
  }
}

// Sync Actions
export async function getPendingSyncOperations(userId: string) {
  try {
    const pendingOps = await db.query.syncQueue.findMany({
      where: eq(syncQueue.userId, userId),
      orderBy: asc(syncQueue.createdAt)
    });
    
    return { success: true, operations: pendingOps };
  } catch (error) {
    console.error('Error fetching sync operations:', error);
    return { success: false, error: 'Failed to fetch sync operations' };
  }
}

export async function markSyncOperationComplete(operationId: string) {
  try {
    await db.update(syncQueue)
      .set({ status: 'synced', syncedAt: new Date() })
      .where(eq(syncQueue.id, operationId));
    
    return { success: true };
  } catch (error) {
    console.error('Error marking sync operation complete:', error);
    return { success: false, error: 'Failed to mark sync operation complete' };
  }
}
