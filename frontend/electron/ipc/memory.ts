import { ipcMain } from 'electron';

/**
 * Registers IPC handlers for local agent memory operations (RAG/Vector DB).
 */
export function registerMemoryIPCHandlers(): void {
  ipcMain.handle('memory:store', async (_event, _payload: { key: string; value: any }) => {
    return { success: true };
  });

  ipcMain.handle('memory:retrieve', async (_event, _key: string) => {
    return null;
  });
}
