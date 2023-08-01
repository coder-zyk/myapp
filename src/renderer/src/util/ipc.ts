import router from '@renderer/router';
import { useMainMessageStore } from '@renderer/store';
import { useConfStore } from '@renderer/store/conf';

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
    console.log(_event, params);
  });
  window.electron.ipcRenderer.on('download-progress', (_event, params) => {
    console.log(_event, params);
  });
  window.electron.ipcRenderer.on('update-downloaded', (_event, params) => {
    console.log(_event, params);
  });
}
export { onMessageByMain };
