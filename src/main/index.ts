import { app, shell, BrowserWindow, Tray, Menu, session } from 'electron';
import { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import icon from '../../resources/icon.png?asset';
import { onIpc } from './util/ipc';
import { readFileSync } from 'fs';
import { checkUpdate } from './util/update';

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 650,
    minHeight: 550,
    show: false,
    titleBarStyle: 'hidden',
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  });

  mainWindow.menuBarVisible = false;
  mainWindow.minimizable = true;
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

  mainWindow.webContents.toggleDevTools();
  // if (is.dev && process.env['ELECTRON_RENDERER_URL']) mainWindow.webContents.toggleDevTools()
  mainWindow.on('ready-to-show', () => {
    const serverAddress = JSON.parse(readFileSync(process.cwd() + '/config.conf').toString());
    onIpc(mainWindow);
    checkUpdate(mainWindow);
    mainWindow.show();
    mainWindow.webContents.send('message', { path: '/' });
    mainWindow.webContents.send('conf', serverAddress);
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
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron');
  session.defaultSession.webRequest.onHeadersReceived(
    { urls: ['https://*.bilibili.com/*'], types: ['xhr'] },
    (details, callback) => {
      if (details.responseHeaders && details.responseHeaders['set-cookie']) {
        for (let i = 0; i < details.responseHeaders['set-cookie'].length; i++) {
          details.responseHeaders['set-cookie'][i] += '; SameSite=None; Secure';
        }
      }
      callback({ cancel: false, responseHeaders: details.responseHeaders });
    }
  );
  // tray.setContextMenu(contextMenu)
  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  createWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
