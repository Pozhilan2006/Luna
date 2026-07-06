export interface Message {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  avatarUrl?: string;
  settings: Settings;
}

export interface Memory {
  id: string;
  content: string;
  tags: string[];
  score?: number;
  timestamp: string;
}

export interface Settings {
  theme: 'light' | 'dark' | 'system';
  apiUrl: string;
  defaultModel: string;
  ollamaHost: string;
  systemPrompt?: string;
}

export interface Permission {
  id: string;
  resource: string;
  action: 'read' | 'write' | 'execute';
  granted: boolean;
}

export interface WindowState {
  isMaximized: boolean;
  width: number;
  height: number;
}

// Declare Electron API type definitions exposed via preload
export interface ElectronAPI {
  sendMessage: (channel: string, data?: any) => void;
  invoke: (channel: string, data?: any) => Promise<any>;
  on: (channel: string, callback: (...args: any[]) => void) => () => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
