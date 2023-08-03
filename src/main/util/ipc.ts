import { ipcMain, BrowserWindow } from 'electron';
import { checkUpdate } from './update';
import { createMainWindow } from '../window/main';
import { createUpdateWindow } from '../window/update';
import fs from 'fs';
import { join } from 'path';
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
  ipcMain.on('exit', () => {
    browserWindow.close();
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
      fs.writeFileSync(
        join(process.cwd(), `/Receive File/${params.name}`),
        new Int32Array(params.raw)
      );
    } else {
      fs.mkdir(join(process.cwd(), '/Receive File'), () => {
        fs.writeFileSync(
          join(process.cwd(), `/Receive File/${params.name}`),
          new Int32Array(params.raw)
        );
      });
    }
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
}
function offIpc() {
  ipcMain.removeAllListeners();
}
export { onIpc, offIpc };
