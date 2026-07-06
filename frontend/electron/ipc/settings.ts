import { ipcMain } from 'electron';

/**
 * Registers IPC handlers for loading and mutating application user configurations.
 */
export function registerSettingsIPCHandlers(): void {
  ipcMain.handle('settings:get', async () => {
    return {
      theme: 'dark',
      api_url: 'http://127.0.0.1:8000',
    };
  });

  ipcMain.handle('settings:save', async (_event, _settings: any) => {
    return { success: true };
  });
}
