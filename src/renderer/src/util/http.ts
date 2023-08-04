import { useConfStore } from '@renderer/store/conf';
import axios from 'axios';
import { ElMessage } from 'element-plus';

const instance = axios.create({
  // baseURL: 'http://192.168.1.2:3000'
  baseURL: `http://${useConfStore().serverAddress}`,
  timeout: 3000
});
instance.interceptors.response.use(
  (response) => {
    if (response.data.code == 1) return response;
    else {
      ElMessage.error(response.data.message);
      return Promise.reject(response.data.message);
    }
  },
  ({ message }) => {
    ElMessage.error(message);
    return Promise.reject(message);
  }
);
class Request {
  get(url, params?) {
    return new Promise<{ code: number; data: unknown; message: string }>((resolve, reject) => {
      instance
        .get(url, {
          params
        })
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  post(url, data?, config?) {
    return new Promise<{ code: number; data: unknown; message: string }>((resolve, reject) => {
      instance
        .post(url, data, config)
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
export const request = new Request();
