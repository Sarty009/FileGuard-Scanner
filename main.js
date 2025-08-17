const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
const { spawn, exec } = require('child_process');

let backendProcess;

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, 'build/icon.ico'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // This line removes the top menu bar
  mainWindow.setMenu(null);

  const startURL = url.format({
    pathname: path.join(__dirname, 'frontend/dist/index.html'),
    protocol: 'file:',
    slashes: true,
  });

  mainWindow.loadURL(startURL);

  // This line is now commented out to prevent the DevTools from opening automatically.
  // mainWindow.webContents.openDevTools();
}

// --- The rest of the file remains the same ---

function startBackend() {
    const serverPath = app.isPackaged
        ? path.join(process.resourcesPath, 'server.exe')
        : path.join(__dirname, 'server.exe');
    try {
      backendProcess = spawn(serverPath);
      backendProcess.stdout.on('data', (data) => console.log(`Backend stdout: ${data}`));
      backendProcess.stderr.on('data', (data) => console.error(`Backend stderr: ${data}`));
      backendProcess.on('error', (err) => console.error('Failed to start backend process.', err));
    } catch (err) {
        console.error('Caught an error while spawning the backend process.', err);
    }
}

app.whenReady().then(() => {
  startBackend();
  createWindow();
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    exec('taskkill /F /IM server.exe', (err, stdout, stderr) => {
        if (err && !stderr.includes("not found")) console.error(err);
        app.quit();
    });
  }
});