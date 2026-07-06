import type { Settings } from '@/types';

/**
 * Service to manage application settings and default preferences.
 */
export const settingsService = {
  /**
   * Retrieves the current user settings configuration object
   */
  async getSettings(): Promise<Settings | null> {
    if (window.electronAPI) {
      return window.electronAPI.invoke('settings:get');
    }
    return null;
  },

  /**
   * Persists changes to the user settings
   */
  async saveSettings(settings: Settings): Promise<{ success: boolean }> {
    if (window.electronAPI) {
      return window.electronAPI.invoke('settings:save', settings);
    }
    return { success: false };
  }
};
