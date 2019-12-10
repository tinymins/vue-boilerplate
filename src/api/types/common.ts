/**
 * 微信 SDK 信息
 */
export interface JssdkConfig {
  /** 是否为调试模式 */
  debug: boolean;
  /** 公众号标识 */
  appId: string;
  /** 生成签名的时间戳 */
  timestamp: number;
  /** 生成签名的随机串 */
  nonceStr: string;
  /** 生成的签名 */
  signature: string;
  /** 需要使用的JS接口列表 */
  jsApiList: string[];
}
