import { offlineDb, OfflineOperations } from './database';
import { encryptUserData, decryptUserData } from '@/lib/encryption/crypto';
import React from 'react';

export class SyncManager {
  private isOnline: boolean = navigator.onLine;
  private syncInterval: NodeJS.Timeout | null = null;
  private retryDelay: number = 5000; // 5 seconds
  private maxRetries: number = 3;

  constructor() {
    this.setupEventListeners();
    this.startPeriodicSync();
  }

  private setupEventListeners() {
    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true;
      console.log('Connection restored, starting sync...');
      this.syncPendingOperations();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      console.log('Connection lost, working offline...');
    });

    // Listen for visibility change to sync when user returns to tab
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && this.isOnline) {
        this.syncPendingOperations();
      }
    });
  }

  private startPeriodicSync() {
    // Sync every 30 seconds when online
    this.syncInterval = setInterval(() => {
      if (this.isOnline) {
        this.syncPendingOperations();
      }
    }, 30000);
  }

  public async syncPendingOperations(): Promise<void> {
    if (!this.isOnline) {
      console.log('Cannot sync: offline');
      return;
    }

    try {
      const pendingOperations = await OfflineOperations.getPendingSyncOperations();
      
      if (pendingOperations.length === 0) {
        console.log('No pending operations to sync');
        return;
      }

      console.log(`Syncing ${pendingOperations.length} pending operations...`);

      for (const operation of pendingOperations) {
        await this.syncOperation(operation);
      }

      console.log('Sync completed successfully');
    } catch (error) {
      console.error('Sync failed:', error);
    }
  }

  private async syncOperation(operation: any): Promise<void> {
    try {
      const { operation: op, tableName, recordId, data } = operation;

      switch (tableName) {
        case 'boards':
          await this.syncBoardOperation(op, recordId, data);
          break;
        case 'lists':
          await this.syncListOperation(op, recordId, data);
          break;
        case 'cards':
          await this.syncCardOperation(op, recordId, data);
          break;
        case 'tasks':
          await this.syncTaskOperation(op, recordId, data);
          break;
        case 'notes':
          await this.syncNoteOperation(op, recordId, data);
          break;
        default:
          console.warn(`Unknown table: ${tableName}`);
      }

      await OfflineOperations.markSyncOperationComplete(operation.id);
    } catch (error) {
      console.error(`Failed to sync operation ${operation.id}:`, error);
      
      const newRetryCount = operation.retryCount + 1;
      
      if (newRetryCount >= this.maxRetries) {
        console.error(`Operation ${operation.id} failed after ${this.maxRetries} retries`);
        await OfflineOperations.markSyncOperationFailed(operation.id, newRetryCount);
      } else {
        await OfflineOperations.markSyncOperationFailed(operation.id, newRetryCount);
        // Retry after delay
        setTimeout(() => {
          this.syncOperation(operation);
        }, this.retryDelay * newRetryCount);
      }
    }
  }

  private async syncBoardOperation(operation: string, recordId: string, data: any): Promise<void> {
    const endpoint = '/api/boards';
    
    switch (operation) {
      case 'create':
        await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        break;
      case 'update':
        await fetch(`${endpoint}/${recordId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        break;
      case 'delete':
        await fetch(`${endpoint}/${recordId}`, {
          method: 'DELETE',
        });
        break;
    }
  }

  private async syncListOperation(operation: string, recordId: string, data: any): Promise<void> {
    const endpoint = '/api/lists';
    
    switch (operation) {
      case 'create':
        await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        break;
      case 'update':
        await fetch(`${endpoint}/${recordId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        break;
      case 'delete':
        await fetch(`${endpoint}/${recordId}`, {
          method: 'DELETE',
        });
        break;
    }
  }

  private async syncCardOperation(operation: string, recordId: string, data: any): Promise<void> {
    const endpoint = '/api/cards';
    
    switch (operation) {
      case 'create':
        await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        break;
      case 'update':
        await fetch(`${endpoint}/${recordId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        break;
      case 'delete':
        await fetch(`${endpoint}/${recordId}`, {
          method: 'DELETE',
        });
        break;
    }
  }

  private async syncTaskOperation(operation: string, recordId: string, data: any): Promise<void> {
    const endpoint = '/api/tasks';
    
    switch (operation) {
      case 'create':
        await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        break;
      case 'update':
        await fetch(`${endpoint}/${recordId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        break;
      case 'delete':
        await fetch(`${endpoint}/${recordId}`, {
          method: 'DELETE',
        });
        break;
    }
  }

  private async syncNoteOperation(operation: string, recordId: string, data: any): Promise<void> {
    const endpoint = '/api/notes';
    
    switch (operation) {
      case 'create':
        await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        break;
      case 'update':
        await fetch(`${endpoint}/${recordId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        break;
      case 'delete':
        await fetch(`${endpoint}/${recordId}`, {
          method: 'DELETE',
        });
        break;
    }
  }

  // Force immediate sync
  public async forceSync(): Promise<void> {
    await this.syncPendingOperations();
  }

  // Get sync status
  public async getSyncStatus(): Promise<{
    isOnline: boolean;
    pendingOperations: number;
    lastSyncAt: Date | null;
  }> {
    const pendingOperations = await OfflineOperations.getPendingSyncOperations();
    const lastSyncAt = pendingOperations.length > 0 
      ? new Date(Math.max(...pendingOperations.map(op => op.timestamp.getTime())))
      : null;

    return {
      isOnline: this.isOnline,
      pendingOperations: pendingOperations.length,
      lastSyncAt,
    };
  }

  // Clean up
  public destroy(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }
}

// Singleton instance
export const syncManager = new SyncManager();

// React hook for sync status
export function useSyncStatus() {
  const [status, setStatus] = React.useState({
    isOnline: navigator.onLine,
    pendingOperations: 0,
    lastSyncAt: null as Date | null,
  });

  React.useEffect(() => {
    const updateStatus = async () => {
      const syncStatus = await syncManager.getSyncStatus();
      setStatus(syncStatus);
    };

    updateStatus();
    
    const interval = setInterval(updateStatus, 5000); // Update every 5 seconds
    
    return () => clearInterval(interval);
  }, []);

  return status;
}