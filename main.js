const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

// Error Handling
process.on('uncaughtException', (error) => {
  console.error('Unexpected error: ', error);
});

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
    },
  });

  if (app.isPackaged) {
    win.loadFile(path.join(__dirname, 'dist', 'Restaurant_POS_system', 'browser', 'index.html'));
  } else {
    win.loadURL('http://localhost:4200');
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

ipcMain.on('open-keyboard', () => {
  console.log('Received open-keyboard event');
  exec('osk');
});

// Handle IPC calls from the renderer process
ipcMain.handle('save-image', (event, { path: imagePath, content }) => {
  console.log(`Received save-image event for path: ${imagePath}`);
  const fullPath = path.join(__dirname, 'dist', 'Restaurant_POS_system', 'browser', 'assets', 'img', imagePath);
  console.log(`Attempting to save image to: ${fullPath}`);
  return new Promise((resolve, reject) => {
    const buffer = Buffer.from(content, 'base64');
    fs.writeFile(fullPath, buffer, (err) => {
      if (err) {
        console.error('Error saving image:', err);
        reject('Error saving image');
      } else {
        console.log('Image saved successfully');
        resolve('Image saved successfully');
      }
    });
  });
});

ipcMain.handle('update-json', (event, { path: jsonPath, content }) => {
  console.log(`Received update-json event for path: ${jsonPath}`);
  const fullPath = path.join(__dirname, 'dist', 'Restaurant_POS_system', 'browser', 'assets', jsonPath);
  console.log(`Attempting to update JSON file at: ${fullPath}`);
  return new Promise((resolve, reject) => {
    fs.writeFile(fullPath, JSON.stringify(content, null, 2), (err) => {
      if (err) {
        console.error('Error updating JSON file:', err);
        reject('Error updating JSON file');
      } else {
        console.log('JSON file updated successfully');
        resolve('JSON file updated successfully');
      }
    });
  });
});

ipcMain.handle('delete-image', (event, { path: imagePath }) => {
  console.log(`Received delete-image event for path: ${imagePath}`);
  const fullPath = path.join(__dirname, 'dist', 'Restaurant_POS_system', 'browser', 'assets', 'img', imagePath);
  console.log(`Attempting to delete image at: ${fullPath}`);
  return new Promise((resolve, reject) => {
    fs.unlink(fullPath, (err) => {
      if (err) {
        console.error('Error deleting image:', err);
        reject('Error deleting image');
      } else {
        console.log('Image deleted successfully');
        resolve('Image deleted successfully');
      }
    });
  });
});
