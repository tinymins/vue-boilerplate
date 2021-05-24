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

/**
 * 空对象
 */
export interface EmptyObject {}

/**
 * 应用初始化环境参数
 */
export interface EntryParams {
  /** Sample: "localhost:8081" */
  host: string;
  /** Sample: "localhost" */
  hostname: string;
  /** Sample: "http://localhost:8081/a/b/c" */
  href: string;
  /** Sample: "http://localhost:8081" */
  origin: string;
  /** Sample: "/a/b/c" */
  pathname: string;
  /** Sample: "8081" */
  port: string;
  /** Sample: "http:" */
  protocol: string;
  userAgent: string;
  headers?: { [key: string]: string };
}
