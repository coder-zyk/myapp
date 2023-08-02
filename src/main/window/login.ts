import { BrowserWindow, Menu, Tray, shell } from 'electron';
import { join } from 'path';
import icon from '../../../resources/favicon.ico?asset';
import { is } from '@electron-toolkit/utils';
import { offIpc, onIpc } from '../util/ipc';
import { checkUpdate } from '../util/update';
/**创建主窗口 */
function createLoginWindow(): void {
  // Create the browser window.
  const loginWindow = new BrowserWindow({
    width: 400,
    height: 500,
    show: false,
    resizable: false,
    titleBarStyle: 'hidden',
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
  tray.setToolTip('electron + vue');
  tray.setContextMenu(contextMenu);
  tray.on('click', () => {
    loginWindow.show();
  });

  // loginWindow.webContents.toggleDevTools();

  loginWindow.on('ready-to-show', () => {
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) loginWindow.webContents.toggleDevTools();
    onIpc(loginWindow);
    checkUpdate(loginWindow);
    loginWindow.show();
    loginWindow.webContents.send('message', { path: '/login' });
  });
  loginWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });
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
