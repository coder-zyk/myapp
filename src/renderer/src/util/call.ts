import { DataConnection, Peer } from 'peerjs';
const TAG = '[PEER]';
export class CallClient {
  client: Peer;
  dataConnect?: DataConnection;
  remoteStream?: MediaStream;
  constructor(user: string) {
    //传入用户id，自定义
    this.client = new Peer(user);
    this.event();
  }
  event() {
    this.client.on('open', async (id) => {
      console.log(TAG, 'peerJs服务连接成功：' + id);
    });
    //当消息连接成功时触发
    this.client.on('connection', (val) => {
      this.dataConnect = val;
      this.dataConnect.on('data', (data) => {
        window.electron.ipcRenderer.send('receive-file', data);
        console.log(data, '接收');
      });
    });
    this.client.on('close', function () {
      console.log(TAG, 'close');
    });
    this.client.on('error', (e) => {
      console.log(TAG, 'error', e);
    });
  }

  //传入好友的用户id，以及本地视频流
  send(friendId: string, data) {
    //创建消息连接
    this.dataConnect = this.client.connect(friendId);
    this.dataConnect.on('open', () => {
      console.log('已连接:', friendId);
      this.dataConnect!.send(data);
    });
    this.dataConnect.on('close', () => {
      console.log('已关闭:', friendId);
    });
    this.dataConnect.dataChannel.addEventListener('message', (event) => {
      console.log(event);
    });
  }
}
