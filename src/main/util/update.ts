import { BrowserWindow } from 'electron';
import { ProgressInfo, UpdateDownloadedEvent, UpdateInfo, autoUpdater } from 'electron-updater';
/**检测新版本 */
function checkUpdate(mainWindow: BrowserWindow) {
  autoUpdater.forceDevUpdateConfig = true;
  autoUpdater.disableWebInstaller = true;
  autoUpdater.setFeedURL({ url: 'http://myusers.cn:9000', provider: 'generic' });
  autoUpdater.checkForUpdates();
  autoUpdater.once('update-available', (info: UpdateInfo) => {
    mainWindow.webContents.send('update-available', info);
  });
  autoUpdater.once('download-progress', (info: ProgressInfo) => {
    mainWindow.webContents.send('download-progress', info);
  });
  autoUpdater.once('update-downloaded', (info: UpdateDownloadedEvent) => {
    mainWindow.webContents.send('update-downloaded', info);
  });
  autoUpdater.once('update-not-available', (info: UpdateInfo) => {
    mainWindow.webContents.send('update-not-available', info);
    // autoUpdater.quitAndInstall();
  });
}
export { checkUpdate };
