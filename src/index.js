const { app,
  BrowserWindow,
  Tray,
  Menu,
  protocol,
  ipcRenderer,
  Notification } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');
//const server="https://hazel-grandzero.vercel.app";
//const server = `https://electron-test-updater.herokuapp.com`
// const url = `${server}/update/${process.platform}/${app.getVersion()}`
//autoUpdater.setFeedURL([url])
//const autoUpdater = new AppUpdater(server)
let win;
setTimeout(()=>{
  autoUpdater.checkForUpdates();
},3000)

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: { 
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      devTools:true
    }
  });
  win=mainWindow;
  win.webContents.openDevTools();
  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
/**
 * 
 * AutoUpdate listeners
 * 
 * 
 */
 autoUpdater.on('checking-for-update', () => {
  const updateNotification = new Notification({
     title:"Güncellemeler kontrol ediliyor",
     body:"Yükleme otomatik olarak başlatılacak"
  })
  updateNotification.show();
});
autoUpdater.on('update-available', info => {
  const updateNotification = new Notification({
     title:"Yeni bir güncelleme mevcut",
     body:"Yükleme otomatik olarak başlatılacak"
  })
  updateNotification.show();
});
//  autoUpdater.on('update-not-available', info => {
//    sendStatusToWindow('Update not available.');
//  });
autoUpdater.on('error', err => {
  const updateNotification = new Notification({
     title:"Güncelleme esnasında bir hata oluştu",
     body:err
  })
  win.webContents.send("message",err);
  //console.log("Güncelleme hatası : ", err);
  updateNotification.show()
});
//  autoUpdater.on('download-progress', progressObj => {
//    sendStatusToWindow(
//      `Download speed: ${progressObj.bytesPerSecond} - Downloaded ${progressObj.percent}% (${progressObj.transferred} + '/' + ${progressObj.total} + )`
//    );
//  });

autoUpdater.on('update-downloaded', info => {
  const restartNotification = new Notification({
     title:"Güncelleme indirildi",
     body:"Program güncel haliyle yüklenip baştan başlatılacak"
  })
  restartNotification.show()
});

autoUpdater.on('update-downloaded', info => {
  // Wait 5 seconds, then quit and install
  // In your application, you don't need to wait 500 ms.
  // You could call autoUpdater.quitAndInstall(); immediately
  autoUpdater.quitAndInstall();
});
