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
};
export type { Message };
