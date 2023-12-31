import router from '@renderer/router';
import { useMainMessageStore } from '@renderer/store';
import { ElMessage, ElMessageBox, dayjs } from 'element-plus';
import { clearLocalStorage, getLocalStorage } from './storage';
import { useUpdateStore } from '@renderer/store/update';
import { useConfStore } from '@renderer/store/conf';
import { useSocketStore } from '@renderer/store/socket';

/**监听主进程发送的消息 */
function onMessageByMain() {
  window.electron.ipcRenderer.on('navigation', (_event, params) => {
    useMainMessageStore().message = params;
    router.push(params.path);
  });
  window.electron.ipcRenderer.on('update-available', (_event, params) => {
    ElMessageBox.confirm(
      `发布日期\uff1a${dayjs(params.releaseDate).format('YYYY-MM-DD')}<br>版本号\uff1a${
        params.version
      }`,
      '检测到新版本,是否安装',
      {
        customStyle: { width: '300px' },
        dangerouslyUseHTMLString: true,
        confirmButtonText: '是',
        cancelButtonText: '否'
      }
    )
      .then(() => {
        window.electron.ipcRenderer.send('install');
      })
      .catch(() => {});
  });
  window.electron.ipcRenderer.on('download-progress', (_event, params) => {
    useUpdateStore().updateInfo = params;
  });
  window.electron.ipcRenderer.on('update-downloaded', (_event, params) => {
    console.log(params);

    useUpdateStore().updateInfo = {
      percent: 100,
      total: 0,
      transferred: 0,
      bytesPerSecond: 0,
      delta: 0
    };
  });
  window.electron.ipcRenderer.on('update-not-available', () => {
    if (getLocalStorage('userInfo'))
      ElMessage.success({ message: '当前已经是最新版本', duration: 1000 });
  });
  window.electron.ipcRenderer.on('exit', () => {
    clearLocalStorage();
  });
  window.electron.ipcRenderer.on('maximize', () => {
    useConfStore().isMax = true;
  });
  window.electron.ipcRenderer.on('unmaximize', () => {
    useConfStore().isMax = false;
  });
  window.electron.ipcRenderer.on('check-failed', () => {
    ElMessage.error('网络异常\uFF0C检查更新失败');
  });
  window.electron.ipcRenderer.on('download-failed', () => {
    ElMessageBox.alert('下载更新失败', '网络异常');
  });
  window.electron.ipcRenderer.on('send-file', () => {});
  window.electron.ipcRenderer.on('socket-message', (_event, params) => {
    useSocketStore().messageData = params;
  });
}
export { onMessageByMain };
