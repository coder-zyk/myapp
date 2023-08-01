import { LoginInfo } from '@renderer/types';
import { request } from '@renderer/util/http';

function Login(params: LoginInfo) {
  return request.post('/login', params);
}
function GetUserList(params: { userName: string }) {
  return request.get('/getUserList', params);
}
function GetMessageList(params: { userName: string; otherUserName: string }) {
  return request.get('/getMessageList', params);
}
export { Login, GetUserList, GetMessageList };
