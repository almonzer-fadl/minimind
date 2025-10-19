"use server";

import { db } from "@/lib/db";
import { users, boards, lists, cards, tasks, notes } from "@/lib/db/schema";
import { eq, desc, asc } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { EncryptionManager } from "@/lib/encryption/crypto";

// User Actions
export async function createUser(email: string, password: string) {
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Generate proper encryption key using EncryptionManager
    const encryptionManager = EncryptionManager.getInstance();
    const salt = await EncryptionManager.getInstance().generateSalt();
    const encryptionKey = await encryptionManager.generateUserKey();
    const encryptionKeyHash = await bcrypt.hash(encryptionKey, 12);
    
    // Use raw SQL approach to avoid Drizzle query issues
    const { neon } = await import('@neondatabase/serverless');
    const sql = neon(process.env.DATABASE_URL!);
    
    const newUser = await sql`
      INSERT INTO users (email, password_hash, encryption_key_hash, created_at, updated_at)
      VALUES (${email}, ${hashedPassword}, ${encryptionKeyHash}, NOW(), NOW())
      RETURNING id, email, created_at, updated_at
    `;
    
    return { success: true, user: newUser[0] };
  } catch (error) {
    console.error('Error creating user:', error);
    return { success: false, error: 'Failed to create user' };
  }
}

export async function verifyUser(email: string, password: string) {
  try {
    // Use raw SQL approach to avoid Drizzle query issues
    const { neon } = await import('@neondatabase/serverless');
    const sql = neon(process.env.DATABASE_URL!);
    
    const userResult = await sql`
      SELECT id, email, password_hash, encryption_key_hash, created_at, updated_at
      FROM users 
      WHERE email = ${email}
      LIMIT 1
    `;
    
    if (!userResult || userResult.length === 0) {
      return { success: false, error: 'User not found' };
    }
    
    const user = userResult[0];
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return { success: false, error: 'Invalid password' };
    }
    
    return { success: true, user: {
      id: user.id,
      email: user.email,
      passwordHash: user.password_hash,
      encryptionKeyHash: user.encryption_key_hash,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    }};
  } catch (error) {
    console.error('Error verifying user:', error);
    return { success: false, error: 'Authentication failed' };
  }
}

export async function getUserById(userId: string) {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId)
    });
    
    if (!user) {
      return { success: false, error: 'User not found' };
    }
    
    return { success: true, user };
  } catch (error) {
    console.error('Error getting user:', error);
    return { success: false, error: 'Failed to get user' };
  }
}

// Board Actions
export async function createBoard(userId: string, name: string, description?: string) {
  try {
    // Provide a default position (e.g., 0) to satisfy the required field
    const newBoard = await db.insert(boards).values({
      userId,
      nameEncrypted: name, // For now, store plain text
      descriptionEncrypted: description || '',
      position: 0, // Add default position value or compute as needed
    }).returning();
    
    return { success: true, board: newBoard[0] };
  } catch (error) {
    console.error('Error creating board:', error);
    return { success: false, error: 'Failed to create board' };
  }
}

export async function getBoardsByUser(userId: string) {
  try {
    const userBoards = await db.query.boards.findMany({
      where: eq(boards.userId, userId),
      orderBy: [asc(boards.createdAt)]
    });
    
    return { success: true, boards: userBoards };
  } catch (error) {
    console.error('Error getting boards:', error);
    return { success: false, error: 'Failed to get boards' };
  }
}

export async function updateBoard(boardId: string, updates: { name?: string; description?: string }) {
  try {
    const updatedBoard = await db.update(boards)
      .set({
        nameEncrypted: updates.name,
        descriptionEncrypted: updates.description,
        updatedAt: new Date(),
      })
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
export async function createList(boardId: string, name: string, position: number) {
  try {
    const newList = await db.insert(lists).values({
      boardId,
      nameEncrypted: name, // For now, store plain text
      position,
    }).returning();
    
    return { success: true, list: newList[0] };
  } catch (error) {
    console.error('Error creating list:', error);
    return { success: false, error: 'Failed to create list' };
  }
}

export async function getListsByBoard(boardId: string) {
  try {
    const boardLists = await db.query.lists.findMany({
      where: eq(lists.boardId, boardId),
      orderBy: [asc(lists.position)]
    });
    
    return { success: true, lists: boardLists };
  } catch (error) {
    console.error('Error getting lists:', error);
    return { success: false, error: 'Failed to get lists' };
  }
}

export async function updateList(listId: string, updates: { name?: string; position?: number }) {
  try {
    const updatedList = await db.update(lists)
      .set({
        nameEncrypted: updates.name,
        position: updates.position,
        updatedAt: new Date(),
      })
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
export async function createCard(listId: string, title: string, description?: string, position: number = 0) {
  try {
    const newCard = await db.insert(cards).values({
      listId,
      titleEncrypted: title, // For now, store plain text
      descriptionEncrypted: description || '',
      position,
    }).returning();
    
    return { success: true, card: newCard[0] };
  } catch (error) {
    console.error('Error creating card:', error);
    return { success: false, error: 'Failed to create card' };
  }
}

export async function getCardsByList(listId: string) {
  try {
    const listCards = await db.query.cards.findMany({
      where: eq(cards.listId, listId),
      orderBy: [asc(cards.position)]
    });
    
    return { success: true, cards: listCards };
  } catch (error) {
    console.error('Error getting cards:', error);
    return { success: false, error: 'Failed to get cards' };
  }
}

export async function updateCard(cardId: string, updates: { title?: string; description?: string; position?: number }) {
  try {
    const updatedCard = await db.update(cards)
      .set({
        titleEncrypted: updates.title,
        descriptionEncrypted: updates.description,
        position: updates.position,
        updatedAt: new Date(),
      })
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
export async function createTask(userId: string, title: string, description?: string, priority: number = 1) {
  try {
    const newTask = await db.insert(tasks).values({
      userId,
      titleEncrypted: title, // For now, store plain text
      descriptionEncrypted: description || '',
      priority,
    }).returning();
    
    return { success: true, task: newTask[0] };
  } catch (error) {
    console.error('Error creating task:', error);
    return { success: false, error: 'Failed to create task' };
  }
}

export async function getTasksByUser(userId: string) {
  try {
    const userTasks = await db.query.tasks.findMany({
      where: eq(tasks.userId, userId),
      orderBy: [desc(tasks.createdAt)]
    });
    
    return { success: true, tasks: userTasks };
  } catch (error) {
    console.error('Error getting tasks:', error);
    return { success: false, error: 'Failed to get tasks' };
  }
}

export async function updateTask(taskId: string, updates: { title?: string; description?: string; completed?: boolean; priority?: number }) {
  try {
    const updatedTask = await db.update(tasks)
      .set({
        titleEncrypted: updates.title,
        descriptionEncrypted: updates.description,
        completed: updates.completed,
        priority: updates.priority,
        updatedAt: new Date(),
      })
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
export async function createNote(userId: string, title: string, content: string, tags?: string) {
  try {
    const newNote = await db.insert(notes).values({
      userId,
      titleEncrypted: title, // For now, store plain text
      contentEncrypted: content, // For now, store plain text
      tagsEncrypted: tags || '',
    }).returning();
    
    return { success: true, note: newNote[0] };
  } catch (error) {
    console.error('Error creating note:', error);
    return { success: false, error: 'Failed to create note' };
  }
}

export async function getNotesByUser(userId: string) {
  try {
    const userNotes = await db.query.notes.findMany({
      where: eq(notes.userId, userId),
      orderBy: [desc(notes.createdAt)]
    });
    
    return { success: true, notes: userNotes };
  } catch (error) {
    console.error('Error getting notes:', error);
    return { success: false, error: 'Failed to get notes' };
  }
}

export async function updateNote(noteId: string, updates: { title?: string; content?: string; tags?: string }) {
  try {
    const updatedNote = await db.update(notes)
      .set({
        titleEncrypted: updates.title,
        contentEncrypted: updates.content,
        tagsEncrypted: updates.tags,
        updatedAt: new Date(),
      })
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

// Encryption helper functions
export async function encryptUserData(data: string, password: string, salt: string): Promise<string> {
  try {
    const encryptionManager = EncryptionManager.getInstance();
    return await encryptionManager.encrypt(data, password, salt);
  } catch (error) {
    console.error('Error encrypting data:', error);
    throw error;
  }
}

export async function decryptUserData(encryptedData: string, password: string, salt: string): Promise<string> {
  try {
    const encryptionManager = EncryptionManager.getInstance();
    return await encryptionManager.decrypt(encryptedData, password, salt);
  } catch (error) {
    console.error('Error decrypting data:', error);
    throw error;
  }
}

export async function generateSalt(): Promise<string> {
  const encryptionManager = EncryptionManager.getInstance();
  return encryptionManager.generateSalt();
}