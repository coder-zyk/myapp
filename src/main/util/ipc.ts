import { ipcMain, BrowserWindow, dialog } from 'electron';
import { checkUpdate } from './update';
import { createMainWindow } from '../window/main';
import { createUpdateWindow } from '../window/update';
import fs from 'fs';
import { join } from 'path';
import { createNoticeWindow } from '../window/notifications';
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
  });
}
function onExit(browserWindow: BrowserWindow) {
  ipcMain.on('exit', (_event, params) => {
    if (params != 'notice') browserWindow.close();
  });
}
function onCheckUpdate(browserWindow: BrowserWindow) {
  ipcMain.on('check-update', () => {
    checkUpdate(browserWindow);
  });
}
function onInstall(browserWindow: BrowserWindow) {
  ipcMain.on('install', () => {
    browserWindow.close();
    createUpdateWindow();
  });
}
function onLogin(browserWindow: BrowserWindow) {
  ipcMain.on('login', (_event, params) => {
    browserWindow.close();
    createMainWindow(params);
  });
}
function onReceiveFile() {
  ipcMain.on('receive-file', (_event, params) => {
    if (fs.existsSync(join(process.cwd(), '/Receive File'))) {
      fs.writeFileSync(join(process.cwd(), `/Receive File/${params.fileName}`), params.data);
    } else {
      fs.mkdir(join(process.cwd(), '/Receive File'), () => {
        fs.writeFileSync(join(process.cwd(), `/Receive File/${params.fileName}`), params.data);
      });
    }
  });
}
function onOpenFile(browserWindow: BrowserWindow) {
  ipcMain.on('open-file', () => {
    dialog
      .showOpenDialog(browserWindow, {
        properties: ['openFile']
      })
      .then((res) => {
        fs.readFile(res.filePaths[0], (_err, data) => {
          const fileName = res.filePaths[0].split('\\').pop();
          browserWindow.webContents.send('send-file', { data, fileName });
        });
      });
  });
}
function onSocketMessage() {
  ipcMain.on('socket-message', (_event, params) => {
    createNoticeWindow(params);
  });
}
function onIpc(browserWindow: BrowserWindow) {
  onMin(browserWindow);
  onMax(browserWindow);
  onClose(browserWindow);
  onExit(browserWindow);
  onCheckUpdate(browserWindow);
  onInstall(browserWindow);
  onLogin(browserWindow);
  onReceiveFile();
  onOpenFile(browserWindow);
  onSocketMessage();
}
function offIpc() {
  ipcMain.removeAllListeners();
  ipcMain.removeHandler('paste');
}
export { onIpc, offIpc };
