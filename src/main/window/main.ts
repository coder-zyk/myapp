import { BrowserWindow, Menu, Tray, shell } from 'electron';
import { join } from 'path';
import icon from '../../../resources/icon.png?asset';
import { is } from '@electron-toolkit/utils';
import { offIpc, onIpc } from '../util/ipc';
import { checkUpdate } from '../util/update';
/**创建主窗口 */
function createMainWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 650,
    minHeight: 600,
    minWidth: 650,
    show: false,
    titleBarStyle: 'hidden',
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  });
  mainWindow.menuBarVisible = false;
  const tray = new Tray(join(__dirname, '../../resources/icon.png'));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '退出',
      click() {
        mainWindow.close();
      }
    }
  ]);
  tray.setToolTip('electron + vue');
  tray.setContextMenu(contextMenu);
  tray.on('click', () => {
    mainWindow.show();
  });

  // mainWindow.webContents.toggleDevTools();

  mainWindow.on('ready-to-show', () => {
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) mainWindow.webContents.toggleDevTools();
    onIpc(mainWindow);
    checkUpdate(mainWindow);
    mainWindow.show();
    mainWindow.webContents.send('message', { path: '/' });
  });
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });
  // mainWindow.webContents.on('did-frame-navigate',(_event,url)=>{
  //   console.log(url,'did-frame-navigate');
  // })
  mainWindow.webContents.on('will-frame-navigate', (details) => {
    // console.log(details, 'will-frame-navigate')
    if (!details.url.includes('https://www.bilibili.com/video/BV1aP4y1o7n1'))
      details.preventDefault();
    // _event.preventDefault()
  });

  mainWindow.webContents.on('did-navigate-in-page', (_event, url, isManFrame) => {
    if (!isManFrame && !url.includes('https://www.bilibili.com/video/BV1aP4y1o7n1')) {
      mainWindow.webContents.goBack();
    }
    // if(details)
  });
  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
  mainWindow.on('close', () => {
    offIpc();
    tray.destroy();
  });
}
export { createMainWindow };
