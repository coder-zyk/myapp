import { LoginInfo } from '@renderer/types';
import { request } from '@renderer/util/http';

function Login(data: LoginInfo) {
  return request.post('/login', data);
}
function GetUserList(params: { userName: string }) {
  return request.get('/getUserList', params);
}
function GetMessageList(params: { userName: string; otherUserName: string }) {
  return request.get('/getMessageList', params);
}
function UpdatePassWord(data: { userName: string; oldPassWord: string; newPassWord: string }) {
  return request.post('/updatePassWord', data);
}
export { Login, GetUserList, GetMessageList, UpdatePassWord };
