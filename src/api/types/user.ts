/**
 * 完整用户信息
 */
export interface UserFull {
  /** 匿名ID=0 */
  id: number;
  /** 显示名字 */
  name: string;
  /** 名字特效，dead=已注销/banned=已囚禁/red,green,#xxx=颜色 */
  color: string;
  /** 头像信息，自己提交@+文件名或空白修改自定义头像 */
  avatar: string;
  /** 性别值，参见 profile-options */
  gender: number;
  /** VIP类型，1=银牌/2=金牌 */
  vipType: number;
  /** 圈子id */
  skin: string;
  /** 荣誉星数 */
  starNum: number;
  /** 经验等级 */
  scoreLevel: number;
  /** 头像额外样式，网址 */
  avatarExtra: string;
  /** 用于IM通讯的ID */
  openImId: string;
  /** 与楼主是绑定关系 */
  couple: boolean;
  /** 性别描述 */
  genderLabel: string;
  /** 星座描述 */
  constellationLabel: string;
  /** 年龄描述 */
  ageLabel: string;
  /** 被关数注 */
  fansCount: number;
  /** 关数注 */
  numFollow: number;
  /** 屏蔽时长 */
  blockTime: number;
  /** 禁方时长 */
  jailTime: number;
  /** 封面图片网址 */
  coverPic: string;
  /** 封面语音网址 */
  coverVoice: string;
  /** 活跃时间 */
  timeActiveLabel: string;
  /** 是否为陪玩服务者 */
  isPlayServant: boolean;
  /** 被赞数 */
  numPraised: number;
  /** 是否关注Ta（仅他人） */
  isFollowed: boolean;
  /** 帖子数（仅自己） */
  numPost: number;
  /** 加入时间（仅自己） */
  timeJoin: number;
  /** 评论数（仅自己） */
  numComment: number;
  /** 点赞数（仅自己） */
  numPraise: number;
  /** 手机号（仅自己） */
  phone: string;
  /** 积分（仅自己） */
  point: number;
  /** 海鳗币（仅自己） */
  coin: number;
  /** 经验值（仅自己） */
  score: number;
  /** 社交资料完善度，0~100（仅自己） */
  snsPercent: number;
  /** 是否默认实名，回复/发帖时（仅自己） */
  isDefaultFamous: boolean;
  /** 微信昵称，未绑为 null（仅自己） */
  wechatNick: string;
  /** 改皮剩余秒数（仅自己） */
  roleUpdateLeft: number;
  /** 权限情况（仅自己） */
  perms: {
    isRoot: boolean;
    isSuper: boolean;
    isAdmin: boolean;
    isPlayAdmin: boolean;
    /* 音鉴权限 */
    isToneAdmin: boolean;
  };
  /** 海鳗昵称，设置后不可更改 */
  realName: string;
  /** 年龄值，参见 profile-options */
  age: number;
  /** 星座值，参见 profile-options */
  constellation: number;
  /** 城市，与省份之间用空格分开 */
  city: string;
  /** 游戏标签，逗号分隔或数组 */
  feature: string;
  /** 正在找，逗号分隔或数组 */
  lookfor: string;
  /** 签名档 */
  signature: string;
  /** 是否显示我的音鉴 */
  isShowTone: boolean;
  /** 是否接收微信通知 */
  isNotifyToWx: boolean;
  /** 是否接收App推送 */
  isNotifyToApp: boolean;
  /** 是否确认陪玩须知 */
  isPlayConfirm: boolean;
  /** 是否只在主页显示15天实名帖 */
  isPrivacy15: boolean;
  /** 是否禁止匿名圈我 */
  isFamousAt: boolean;
  /** 是否禁止被扩列 */
  isNoMatch: boolean;
  /** 今日是否签到 */
  isTodaySigned: boolean;
  /** 是否隐藏在线时间 */
  isHideOnline: boolean;
  /** 关闭附近的帖子功能 */
  isNoCity: boolean;
  /** 名字颜色（金牌可改），仅自己 */
  nameColor: string;
  /** 延续/开通VIP天数 */
  vipDuration: number;
  /** 修改头像剩余秒数 */
  avatarUpdateLeft: number;
  /** 背景图片id */
  picId: number;
  /** 加入时间（仅自己 */
  timeJoinLabel: string;
  /** 关注状态（仅他人，1=已关注/2=互关） */
  followStatus?: number;
  /** 注册状态 */
  registerState?: number;
}
