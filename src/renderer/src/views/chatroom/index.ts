/**消息 */
type Message = {
  /**消息发出的用户ID */
  fromUserName: string;
  /**消息接收方 */
  toUserName: string;
  /**发送时间 */
  createTime: number;
  /**内容 */
  content: string;
  /**消息类型 1文本,2文件*/
  type: 1 | 2;
};
export type { Message };
