import { contextBridge, ipcRenderer } from 'electron';

// Safe IPC channel whitelists
const VALID_SEND_CHANNELS = ['window:minimize', 'window:maximize', 'window:close'];
const VALID_INVOKE_CHANNELS = [
  'system:get-info',
  'ai:query',
  'memory:store',
  'memory:retrieve',
  'settings:get',
  'settings:save',
];
const VALID_ON_CHANNELS = ['system:notification'];

contextBridge.exposeInMainWorld('electronAPI', {
  /**
   * Safe one-way message sending (Renderer -> Main)
   */
  sendMessage: (channel: string, data?: any): void => {
    if (VALID_SEND_CHANNELS.includes(channel)) {
      ipcRenderer.send(channel, data);
    } else {
      console.warn(`Blocked unauthorized IPC Send on channel: ${channel}`);
    }
  },

  /**
   * Safe asynchronous request-response invokes (Renderer -> Main -> Renderer)
   */
  invoke: (channel: string, data?: any): Promise<any> => {
    if (VALID_INVOKE_CHANNELS.includes(channel)) {
      return ipcRenderer.invoke(channel, data);
    }
    return Promise.reject(new Error(`Blocked unauthorized IPC Invoke on channel: ${channel}`));
  },

  /**
   * Safe main-to-renderer event listening
   */
  on: (channel: string, callback: (...args: any[]) => void): (() => void) => {
    if (VALID_ON_CHANNELS.includes(channel)) {
      const subscription = (_event: any, ...args: any[]) => callback(...args);
      ipcRenderer.on(channel, subscription);
      // Return a cleanup function to unsubscribe the listener
      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    }
    return () => {};
  },
});
