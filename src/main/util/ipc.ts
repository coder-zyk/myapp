import { ipcMain, BrowserWindow } from 'electron';
import { checkUpdate } from './update';
import { createMainWindow } from '../window/main';
import { createUpdateWindow } from '../window/update';

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
  ipcMain.on('login', () => {
    browserWindow.close();
    createMainWindow();
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
}
function offIpc() {
  ipcMain.removeAllListeners();
}
export { onIpc, offIpc };
