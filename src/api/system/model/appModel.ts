import { ACTIVE_STATUS, PageParam, PageResult } from '@/constants';

// 分页请求参数
export interface AppPageParam extends PageParam {
  name: string;
}

export interface AppPageResult extends PageResult {
  records: Array<AppResult>;
}

export interface AppVersionListResult extends PageResult {
  records: Array<AppResult>;
}

// 请求参数
export interface AppParam {
  name: string;
  status: ACTIVE_STATUS;
  remarks: string;
}
export interface AppVersionParam {
  parentId: string;
  name: string;
  status: ACTIVE_STATUS;
  remarks: string;
}

// 返回参数
export interface AppResult {
  name: string;
  status: ACTIVE_STATUS;
  remarks: string;
  cTime: Date;
}
export interface AppVersionResult {
  name: string;
  appId: string;
  parentId: string;
  uid: string;
  status: ACTIVE_STATUS;
  remarks: string;
  cTime: Date;
}
