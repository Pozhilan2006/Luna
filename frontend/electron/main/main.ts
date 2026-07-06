import { app, BrowserWindow } from 'electron';
import * as path from 'path';

// Import custom IPC handlers
import { registerWindowIPCHandlers } from '../ipc/window';
import { registerSystemIPCHandlers } from '../ipc/system';
import { registerAIIPCHandlers } from '../ipc/ai';
import { registerMemoryIPCHandlers } from '../ipc/memory';
import { registerSettingsIPCHandlers } from '../ipc/settings';

let mainWindow: BrowserWindow | null = null;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 650,
    frame: false, // Transparent custom frame layout
    backgroundColor: '#030712', // Matches Tailwind gray-950
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Register all system-level and feature-level IPC routes
  registerWindowIPCHandlers();
  registerSystemIPCHandlers();
  registerAIIPCHandlers();
  registerMemoryIPCHandlers();
  registerSettingsIPCHandlers();

  // Load URL depending on active packaging mode
  if (process.env.NODE_ENV === 'development' || !app.isPackaged) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
