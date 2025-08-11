const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url'); // Import the url module
const { spawn, exec } = require('child_process');

let backendProcess;

// Function to create the main application window
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      // It's more secure to keep these settings, but for debugging,
      // we ensure they are not causing issues.
      nodeIntegration: true,
      contextIsolation: false,
      // The preload script is often needed for secure communication
      // between the main process and the renderer process.
      // preload: path.join(__dirname, 'preload.js') // We'll keep this commented for now
    },
  });

  // Create a URL to the index.html file. This is more robust than loadFile.
  const startURL = url.format({
    pathname: path.join(__dirname, 'frontend/dist/index.html'),
    protocol: 'file:',
    slashes: true,
  });

  mainWindow.loadURL(startURL);

  // Automatically open the DevTools for debugging.
  // You can comment this line out for the final production build.
  mainWindow.webContents.openDevTools();
}

// Start the Python backend server
function startBackend() {
    const serverPath = app.isPackaged
        ? path.join(process.resourcesPath, 'server.exe')
        : path.join(__dirname, 'server.exe');

    try {
      backendProcess = spawn(serverPath);

      backendProcess.stdout.on('data', (data) => {
          console.log(`Backend stdout: ${data}`);
      });

      backendProcess.stderr.on('data', (data) => {
          console.error(`Backend stderr: ${data}`);
      });

      backendProcess.on('error', (err) => {
          console.error('Failed to start backend process.', err);
      });

    } catch (err) {
        console.error('Caught an error while spawning the backend process.', err);
    }
}

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
  startBackend();
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    // Kill the backend process before quitting
    exec('taskkill /F /IM server.exe', (err, stdout, stderr) => {
        if (err) {
            if (!stderr.includes("not found")) {
                console.error(err);
            }
        }
        app.quit();
    });
  }
});
