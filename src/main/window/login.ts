import { BrowserWindow, Menu, Tray } from 'electron';
import { join } from 'path';
import icon from '../../../resources/favicon.ico?asset';
import { is } from '@electron-toolkit/utils';
import { offIpc, onIpc } from '../util/ipc';
import { autoUpdater } from 'electron-updater';
import { createUpdateWindow } from './update';
/**创建主窗口 */
function createLoginWindow(): void {
  // Create the browser window.
  const loginWindow = new BrowserWindow({
    width: 320,
    height: 450,
    show: false,
    resizable: false,
    titleBarStyle: 'hidden',
    icon: join(__dirname, '../../resources/favicon.ico'),
    fullscreenable: false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  });
  loginWindow.menuBarVisible = false;
  const tray = new Tray(join(__dirname, '../../resources/favicon.ico'));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '退出',
      click() {
        loginWindow.close();
      }
    }
  ]);
  tray.setToolTip('登陆');
  tray.setContextMenu(contextMenu);
  tray.on('click', () => {
    loginWindow.show();
  });

  loginWindow.on('ready-to-show', () => {
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      autoUpdater.forceDevUpdateConfig = true;
      loginWindow.webContents.toggleDevTools();
    }
    loginWindow.webContents.send('navigation', { path: '/' });
    onIpc(loginWindow);
    loginWindow.show();
    // loginWindow.webContents.send('navigation', { path: '/' });
    autoUpdater.checkForUpdates().catch(() => {
      loginWindow.webContents.send('check-failed');
    });
    autoUpdater.disableWebInstaller = false;
    autoUpdater.autoDownload = false;
    autoUpdater.once('update-available', () => {
      createUpdateWindow();
      loginWindow.close();
    });
  });
  // loginWindow.webContents.setWindowOpenHandler((details) => {
  //   shell.openExternal(details.url);
  //   return { action: 'deny' };
  // });
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    loginWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    loginWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
  loginWindow.on('close', () => {
    offIpc();
    tray.destroy();
  });
}
export { createLoginWindow };
