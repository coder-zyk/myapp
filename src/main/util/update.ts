import { is } from '@electron-toolkit/utils';
import { BrowserWindow } from 'electron';
import { ProgressInfo, UpdateInfo, autoUpdater } from 'electron-updater';

/**检测新版本 */
function checkUpdate(mainWindow: BrowserWindow) {
  if (is.dev) autoUpdater.forceDevUpdateConfig = true;
  autoUpdater.disableWebInstaller = true;
  autoUpdater.autoDownload = false;
  // autoUpdater.setFeedURL({ url: 'http://myusers.cn:9000', provider: 'generic' });
  autoUpdater.checkForUpdates().catch(() => {
    mainWindow.webContents.send('check-failed');
  });
  autoUpdater.once('update-available', (info: UpdateInfo) => {
    mainWindow.webContents.send('update-available', info);
  });
  autoUpdater.once('update-not-available', (info: UpdateInfo) => {
    mainWindow.webContents.send('update-not-available', info);
  });
}
function install(mainWindow: BrowserWindow) {
  if (is.dev) autoUpdater.forceDevUpdateConfig = true;
  autoUpdater.checkForUpdates();
  autoUpdater.once('update-available', () => {
    autoUpdater.downloadUpdate().catch(() => {
      mainWindow.webContents.send('download-failed');
    });
  });
  function downloadProgress(info: ProgressInfo) {
    mainWindow.webContents.send('download-progress', info);
  }
  autoUpdater.on('download-progress', downloadProgress);
  autoUpdater.once('update-downloaded', () => {
    autoUpdater.quitAndInstall();
    autoUpdater.off('download-progress', downloadProgress);
  });
}
export { checkUpdate, install };
