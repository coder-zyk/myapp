type SocketUtilEvent = 'message' | 'open' | 'close';
class SocktUtil {
  private listeners: { event: SocketUtilEvent; fn: (params: unknown) => void }[] = [];
  socket?: WebSocket;
  private static instance?: SocktUtil;
  private static url: string;
  /**重启定时器 */
  private timer?: NodeJS.Timeout;
  /**ping定时器 */
  private pingTimer?: NodeJS.Timer;
  constructor(url: string) {
    if (SocktUtil.instance) {
      return SocktUtil.instance;
    } else {
      this.socket = new WebSocket(url);
      this._init();
      SocktUtil.instance = this;
      SocktUtil.url = url;
    }
  }
  private _init() {
    this.socket!.onopen = (event) => {
      this.pingTimer = setInterval(() => {
        this.socket?.send('ping');
      }, 30000);
      this.emit('open', event);
      clearTimeout(this.timer);
    };
    this.socket!.onclose = (event) => {
      clearInterval(this.pingTimer);
      this.timer = setTimeout(() => {
        this.socket = new WebSocket(SocktUtil.url);
        this._init();
      }, 3000);
      this.emit('close', event);
    };
    this.socket!.onmessage = (event) => {
      if (event.data != 'pong') this.emit('message', JSON.parse(event.data));
    };
  }
  on(event: SocketUtilEvent, fn: (params: unknown) => void) {
    if (!this.listeners.find((item) => item.fn == fn)) {
      this.listeners.push({ event, fn });
    }
  }
  off(event: SocketUtilEvent, fn: (params: unknown) => void) {
    this.listeners = this.listeners.filter((item) => !(item.event == event && item.fn == fn));
  }
  send(message: unknown) {
    if (this.socket?.readyState == WebSocket.OPEN) this.socket?.send(JSON.stringify(message));
  }
  private emit(event: SocketUtilEvent, params: unknown) {
    this.listeners
      .filter((item) => item.event == event)
      .forEach((item) => {
        item.fn(params);
      });
  }
  clear() {
    SocktUtil.instance = undefined;
  }
}
export default SocktUtil;
