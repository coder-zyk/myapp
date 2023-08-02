import { ipcMain, BrowserWindow } from 'electron';
import { checkUpdate } from './update';
import { autoUpdater } from 'electron-updater';
import { createMainWindow } from '../window/main';

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
function onInstall() {
  ipcMain.on('install', () => {
    autoUpdater.downloadUpdate();
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
  onInstall();
  onLogin(browserWindow);
}
function offIpc() {
  ipcMain.removeAllListeners();
}
export { onIpc, offIpc };
