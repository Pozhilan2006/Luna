/**
 * Service to manage direct Electron-specific operations via whitelisted IPC contexts.
 */
export const electronService = {
  /**
   * Minimizes the main browser window
   */
  minimizeWindow(): void {
    if (window.electronAPI) {
      window.electronAPI.sendMessage('window:minimize');
    }
  },

  /**
   * Maximizes or unmaximizes the main browser window
   */
  maximizeWindow(): void {
    if (window.electronAPI) {
      window.electronAPI.sendMessage('window:maximize');
    }
  },

  /**
   * Closes the main browser window
   */
  closeWindow(): void {
    if (window.electronAPI) {
      window.electronAPI.sendMessage('window:close');
    }
  },

  /**
   * Fetches processor, runtime platform, and environment details from the main process
   */
  async getSystemInfo(): Promise<{ platform: string; arch: string; nodeVersion: string } | null> {
    if (window.electronAPI) {
      return window.electronAPI.invoke('system:get-info');
    }
    return null;
  }
};
