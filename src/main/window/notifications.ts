import { is } from '@electron-toolkit/utils';
import { BrowserWindow, ipcMain, screen } from 'electron';
import { join } from 'path';
let noticeWindow: BrowserWindow | null;
/**创建通知窗口 */
function createNoticeWindow(params): void {
  if (!noticeWindow) {
    noticeWindow = new BrowserWindow({
      width: 300,
      height: 200,
      show: false,
      frame: false, // 无边框
      skipTaskbar: true, // 使窗口不显示在任务栏中
      movable: false, // 禁止窗口被用户移动
      resizable: false, // 禁止窗口手动调整窗口大小
      fullscreenable: false, // 禁止窗口可以进入全屏状态
      alwaysOnTop: true, // 窗口是否永远在别的窗口的上面
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false
      }
    });
    const { height, width } = screen.getPrimaryDisplay().workAreaSize;
    noticeWindow.setPosition(width - 300, height - 200);
    noticeWindow.menuBarVisible = false;
    noticeWindow.on('ready-to-show', () => {
      noticeWindow?.webContents.send('navigation', { path: '/notice' });
      noticeWindow?.webContents.send('socket-message', params);
      noticeWindow?.showInactive();
    });
    ipcMain.on('exit', () => {
      noticeWindow?.close();
    });
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      noticeWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
    } else {
      noticeWindow.loadFile(join(__dirname, '../renderer/index.html'));
    }
    noticeWindow.on('close', () => {
      noticeWindow = null;
    });
    // 显示但不聚焦于窗口（建议做延时处理）
  } else {
    noticeWindow.webContents.send('socket-message', params);
  }
}
export { createNoticeWindow };
