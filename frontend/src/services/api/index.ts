const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

/**
 * Service to manage direct HTTP communication with the FastAPI backend.
 */
export const apiService = {
  /**
   * Hits the health endpoint of the backend
   */
  async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${API_URL}/health`);
      if (!res.ok) return false;
      const data = await res.json();
      return data.status === 'ok';
    } catch {
      return false;
    }
  },
  
  /**
   * Fetches backend version details
   */
  async getVersion(): Promise<{ title: string; version: string } | null> {
    try {
      const res = await fetch(`${API_URL}/version`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }
};
