const path = require('path');
const {GlobalKeyboardListener} = require("node-global-key-listener");
const { app, BrowserWindow, desktopCapturer, ipcMain, dialog} = require('electron');
const { recognize } = require('tesseract.js');
const screenshot = require('screenshot-desktop');
const fs = require('node:fs')
const clipboard = require('electron');
const v = new GlobalKeyboardListener();
const readline = require('readline')
const uniques = []

function paste(){
    const image = clipboard.clipboard.readImage("clipboard");
    
    fs.writeFileSync(path.join(__dirname,'img.png'),Buffer.from(image.toPNG()));
}
function loadcsv(filepath){
    var lineReader = readline.createInterface({
        input: fs.createReadStream(filepath)
      });
      
      lineReader.on('line', function (line) {
        uniques.push(line);
        console.log(line);
      });
      
      lineReader.on('close', function () {
          console.log('all done, son');
      });
}

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
v.addListener(function (e, down) {
    if (e.state == "DOWN" && e.name == "A" && (down["LEFT CTRL"] || down["RIGHT CTRL"])) {
        paste()
        return true;
    }
});

function popup(){
        recognize("img.png","eng").then(out => {
            console.log(out.data.text)
            msg = "Raw Data:" + out.data.text.toLowerCase() +"\n\n" + "Unique: "
            for(i in uniques){
                console.log(uniques[i]);
                if (out.data.text.toLowerCase().includes(uniques[i].toLowerCase().split(",")[0])){
                    msg += uniques[i].split(",")[0] +"\n Price:" +uniques[i].split(",")[1];
                    break;
                }
            } 
            dialog.showMessageBox(mainWindow,{
                message : msg
            })

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
    loadcsv("UniqueList.csv");
    console.log(uniques);
})

app.on('window-all-closed', () => {
    app.quit();
  });