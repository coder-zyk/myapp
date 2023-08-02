import router from '@renderer/router';
import { useMainMessageStore } from '@renderer/store';
import { ElMessage, ElMessageBox, dayjs } from 'element-plus';
import { getLocalStorage } from './storage';
import { useUpdateStore } from '@renderer/store/update';

/**监听主进程发送的消息 */
function onMessageByMain() {
  window.electron.ipcRenderer.on('message', (_event, params) => {
    useMainMessageStore().message = params;
    router.push(params.path);
  });
  window.electron.ipcRenderer.on('update-available', (_event, params) => {
    console.log('已发布新版本', params);
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
    console.log(params);
    useUpdateStore().updateInfo = params;
  });
  window.electron.ipcRenderer.on('update-downloaded', (_event, params) => {
    console.log(params);
    // useUpdateStore().updateInfo = {
    //   percent:100
    // };
  });
  window.electron.ipcRenderer.on('update-not-available', (_event, params) => {
    console.log('已经是最新版本', params);
    if (getLocalStorage('userInfo'))
      ElMessage.success({ message: '当前已经是最新版本', duration: 1000 });
  });
}
export { onMessageByMain };
