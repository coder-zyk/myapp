import { ipcMain, BrowserWindow } from 'electron';

function onMin(browserWindow: BrowserWindow) {
  ipcMain.on('min', () => {
    browserWindow.minimize();
  });
}
function onMax(browserWindow: BrowserWindow) {
  ipcMain.on('max', () => {
    console.log(browserWindow.isMaximized());
    if (browserWindow.isMaximized()) browserWindow.unmaximize();
    else browserWindow.maximize();
  });
}
function onClose(browserWindow: BrowserWindow) {
  ipcMain.on('close', () => {
    browserWindow.hide();
    // browserWindow.close()
  });
}
function onExit(browserWindow: BrowserWindow) {
  ipcMain.on('exit', () => {
    browserWindow.close();
    // browserWindow.close()
  });
}
function onIpc(browserWindow: BrowserWindow) {
  onMin(browserWindow);
  onMax(browserWindow);
  onClose(browserWindow);
  onExit(browserWindow);
}
export { onIpc };
