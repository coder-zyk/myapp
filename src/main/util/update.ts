import { BrowserWindow } from 'electron';
import { ProgressInfo, UpdateDownloadedEvent, UpdateInfo, autoUpdater } from 'electron-updater';

/**检测新版本 */
function checkUpdate(mainWindow: BrowserWindow) {
  function downloadProgress(info: ProgressInfo) {
    mainWindow.webContents.send('download-progress', info);
  }
  // autoUpdater.forceDevUpdateConfig = true;
  autoUpdater.disableWebInstaller = true;
  autoUpdater.autoDownload = false;
  // autoUpdater.setFeedURL({ url: 'http://myusers.cn:9000', provider: 'generic' });
  autoUpdater.checkForUpdates();
  autoUpdater.once('update-available', (info: UpdateInfo) => {
    mainWindow.webContents.send('update-available', info);
  });
  autoUpdater.on('download-progress', downloadProgress);
  autoUpdater.once('update-downloaded', (info: UpdateDownloadedEvent) => {
    mainWindow.webContents.send('update-downloaded', info);
    autoUpdater.quitAndInstall();
    autoUpdater.off('download-progress', downloadProgress);
  });
  autoUpdater.once('update-not-available', (info: UpdateInfo) => {
    mainWindow.webContents.send('update-not-available', info);
  });
}
export { checkUpdate };
