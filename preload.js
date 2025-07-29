const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  saveImage: (data) => ipcRenderer.invoke('save-image', data),
  updateJson: (data) => ipcRenderer.invoke('update-json', data),
  deleteImage: (data) => ipcRenderer.invoke('delete-image', data),
  openKeyboard: () => ipcRenderer.send('open-keyboard'),
  closeKeyboard: () => ipcRenderer.send('close-keyboard'),
});

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type]);
  }
});
