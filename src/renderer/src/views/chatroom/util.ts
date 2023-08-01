/**去除消息中末尾的空格和换行 */
function checkMessage(message: string) {
  while (/(\s)$/.test(message)) {
    message = message.replace(/(\s)$/, '');
  }
  return message;
}
export { checkMessage };
