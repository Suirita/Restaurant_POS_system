const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  openKeyboard: () => ipcRenderer.send('open-keyboard')
});