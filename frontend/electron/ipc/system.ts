import { ipcMain } from 'electron';

/**
 * Registers IPC handlers for fetching system-level metadata.
 */
export function registerSystemIPCHandlers(): void {
  ipcMain.handle('system:get-info', async () => {
    return {
      platform: process.platform,
      arch: process.arch,
      nodeVersion: process.version,
    };
  });
}
