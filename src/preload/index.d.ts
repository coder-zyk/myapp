import { ElectronAPI } from '@electron-toolkit/preload';
import { type Clipboard } from 'electron';
declare global {
  interface Window {
    electron: ElectronAPI;
    api: { conf: { serverAddress: string }; clipboard: Clipboard; fs };
  }
}
