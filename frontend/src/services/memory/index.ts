import type { Memory } from '@/types';

/**
 * Service to manage long-term semantic memory storage operations.
 */
export const memoryService = {
  /**
   * Stores a piece of information or conversation context into the memory database
   */
  async storeMemory(key: string, value: any): Promise<{ success: boolean }> {
    if (window.electronAPI) {
      return window.electronAPI.invoke('memory:store', { key, value });
    }
    return { success: false };
  },

  /**
   * Resolves a key or retrieves structured memory contexts
   */
  async retrieveMemory(key: string): Promise<Memory | null> {
    if (window.electronAPI) {
      return window.electronAPI.invoke('memory:retrieve', key);
    }
    return null;
  }
};
