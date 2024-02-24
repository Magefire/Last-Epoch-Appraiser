const { contextBridge, ipcRenderer } = require('electron')
contextBridge.exposeInMainWorld('bridge',{
    connect: (message) => ipcRenderer.on("setText",message)
});