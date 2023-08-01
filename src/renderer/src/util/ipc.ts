import router from '@renderer/router';
import { useMainMessageStore } from '@renderer/store';
import { useConfStore } from '@renderer/store/conf';
import { ElMessage, ElMessageBox, dayjs } from 'element-plus';

/**监听主进程发送的消息 */
function onMessageByMain() {
  window.electron.ipcRenderer.on('message', (_event, params) => {
    useMainMessageStore().message = params;
    router.push(params.path);
  });
  window.electron.ipcRenderer.on('conf', (_event, params) => {
    useConfStore().conf = params;
  });
  window.electron.ipcRenderer.on('update-available', (_event, params) => {
    console.log('已发布新版本', params);
  });
  window.electron.ipcRenderer.on('download-progress', (_event, params) => {
    console.log(params);
  });
  window.electron.ipcRenderer.on('update-downloaded', (_event, params) => {
    console.log(params);
    ElMessageBox.confirm(
      `发布日期\uff1a${dayjs(params.releaseDate).format('YYYY-MM-DD HH:mm:ss')}<br />版本号\uff1a${
        params.version
      }`,
      '检测到新版本,是否马上安装',
      {
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
  window.electron.ipcRenderer.on('update-not-available', (_event, params) => {
    console.log('已经是最新版本', params);
    ElMessage.success('当前已是最新版本');
  });
}
export { onMessageByMain };
