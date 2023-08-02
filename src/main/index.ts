import { app, BrowserWindow, session } from 'electron';
import { electronApp, optimizer } from '@electron-toolkit/utils';
import { createLoginWindow } from './window/login';

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

  createLoginWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createLoginWindow();
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
