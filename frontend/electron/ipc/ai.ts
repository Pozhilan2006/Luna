import { ipcMain } from 'electron';

/**
 * Registers IPC handlers for local AI model inference.
 */
export function registerAIIPCHandlers(): void {
  ipcMain.handle('ai:query', async (_event, payload: { prompt: string; model?: string }) => {
    // Skeletons for future Ollama connection
    return {
      response: `AI response skeleton for prompt: "${payload.prompt}"`,
      model: payload.model || 'phi4-mini',
    };
  });
}
