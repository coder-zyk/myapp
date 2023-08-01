import { BrowserView, BrowserWindow, Menu, MenuItemConstructorOptions } from 'electron';
/**设置菜单 */
function setMenu() {
  const templateMenu: MenuItemConstructorOptions[] = [
    {
      label: '首页',
      click(_menuItem, browserWindow, _event) {
        closeView(browserWindow!);
        browserWindow?.webContents.send('message', {
          path: '/'
        });
      }
    },
    {
      label: '科目',
      submenu: [
        {
          label: '数学',
          click(_menuItem, browserWindow) {
            // browserWindow?.hide()
            const view = new BrowserView();
            view.setAutoResize({ width: true, height: true });
            const winBounds = browserWindow?.getBounds();
            view.setBounds({ x: 0, y: 0, width: winBounds?.width!, height: winBounds?.height! });
            browserWindow!.setBrowserView(view);
            view.webContents.loadURL('https://bilibili.com/video/BV1aP4y1o7n1');
            view.webContents.on('will-navigate', (_event, url) => {
              if (!url.includes('https://www.bilibili.com/video/BV1aP4y1o7n1'))
                _event.preventDefault();
            });
            view.webContents.on('did-navigate-in-page', (_event, url) => {
              if (!url.includes('https://www.bilibili.com/video/BV1aP4y1o7n1'))
                view.webContents.goBack();
            });
            view.webContents.on('media-started-playing', (event) => {
              console.log(event, 'media-started-playing');
            });
            view.webContents.on('media-paused', (event) => {
              console.log(event, 'media-paused');
            });
            view.webContents.setWindowOpenHandler(() => {
              return {
                action: 'deny'
              };
            });
          }
        }
      ]
    },
    {
      label: '聊天室',
      click(_menuItem, browserWindow) {
        closeView(browserWindow!);
        browserWindow?.webContents.send('message', {
          path: '/chat'
        });
      }
    }
  ];
  const menu = Menu.buildFromTemplate(templateMenu);
  Menu.setApplicationMenu(menu);
}
function closeView(browserWindow: BrowserWindow) {
  const view = browserWindow?.getBrowserView();
  if (view) {
    view.webContents.close();
    browserWindow.removeBrowserView(view);
  }
}
export { setMenu };
