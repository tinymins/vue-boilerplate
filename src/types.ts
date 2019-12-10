/**
 * 用于对象下标的类型
 */
export type PropKey = string | number;

/**
 * 用于做唯一标识符的类型
 */
export type UniqueID = symbol | string | number;

/**
 * 具有唯一标识符的对象
 */
export interface BasicUniqueObject {
  /** 唯一标示符 */
  id?: UniqueID;
}
