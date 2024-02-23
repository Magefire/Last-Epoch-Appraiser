const path = require('path');
const {GlobalKeyboardListener} = require("node-global-key-listener");
const { app, BrowserWindow, desktopCapturer, ipcMain, dialog} = require('electron');
const { recognize } = require('tesseract.js');
const screenshot = require('screenshot-desktop');
const fs = require('node:fs')

const v = new GlobalKeyboardListener();
const window = null;


v.addListener(function (e, down) {
    if (e.state == "DOWN" && e.name == "D" && (down["LEFT CTRL"] || down["RIGHT CTRL"])) {
        popup()
        return true;
    }
});

v.addListener(function (e, down) {
    if (e.state == "DOWN" && e.name == "ESCAPE" && (down["LEFT ALT"] || down["RIGHT ALT"])) {
        console.log("poof")
        app.quit()
        return true;
    }
});

function popup(){
    screenshot({ filename: 'shot.png' }).then((imgPath) => {
        recognize("shot.png","eng").then(out => {
            console.log(out.data.text)
            dialog.showMessageBox(mainWindow,{
                message : out.data.text
            })

        });
    });
}

function createMainWindow(){
    const mainWindow = new BrowserWindow({
        frame:false,
        titleBarStyle:'hidden',
        title:'LE-Appraiser',
        transparent : true
    })
    mainWindow.setIgnoreMouseEvents(true)
    mainWindow.setFocusable(false);
    mainWindow.maximize();
    mainWindow.loadFile(path.join(__dirname,"./src/index.html"))
    mainWindow.setAlwaysOnTop(true);
    return mainWindow
}

app.whenReady().then(()=>{
    mainWindow = createMainWindow();
})

app.on('window-all-closed', () => {
    app.quit();
  });