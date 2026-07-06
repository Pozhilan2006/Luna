import { contextBridge, ipcRenderer } from 'electron';

// Expose safe, scoped API to the React application
contextBridge.exposeInMainWorld('electronAPI', {
  sendMessage: (channel: string, data: any) => ipcRenderer.send(channel, data),
  onMessage: (channel: string, callback: (...args: any[]) => void) => {
    const subscription = (_event: any, ...args: any[]) => callback(...args);
    ipcRenderer.on(channel, subscription);
    return () => {
      ipcRenderer.removeListener(channel, subscription);
    };
  }
});
