import { BrowserWindow, shell } from 'electron';
import { join } from 'path';
import icon from '../../../resources/favicon.ico?asset';
import { is } from '@electron-toolkit/utils';
import { offIpc, onIpc } from '../util/ipc';
import { install } from '../util/update';
/**创建更新窗口 */
function createUpdateWindow(): void {
  // Create the browser window.
  const updateWindow = new BrowserWindow({
    width: 600,
    height: 200,
    show: false,
    resizable: false,
    fullscreenable: false,
    title: '下载中',
    icon: join(__dirname, '../../resources/favicon.ico'),
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  });
  updateWindow.menuBarVisible = false;
  updateWindow.on('ready-to-show', () => {
    onIpc(updateWindow);
    install(updateWindow);
    updateWindow.show();
    updateWindow.webContents.send('message', { path: '/update' });
  });
  updateWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    updateWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    updateWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
  updateWindow.on('close', () => {
    offIpc();
  });
}
export { createUpdateWindow };
