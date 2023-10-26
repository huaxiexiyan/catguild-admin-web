import { ACTIVE_STATUS, PageParam, PageResult } from '@/constants';

import { MenuResult } from './menuModel';

// 分页请求参数
export interface AppPageParam extends PageParam {
  name: string;
}

export interface AppPageResult extends PageResult {
  records: Array<AppResult>;
}

// 请求参数
export interface AppParam {
  id?: string;
  name?: string;
  activeStatus?: ACTIVE_STATUS;
  describe?: string;
  parentApp?: { id: string };
}

// 返回参数
export interface AppResult {
  id?: string;
  name?: string;
  parentApp?: AppResult;
  activeStatus?: ACTIVE_STATUS;
  describe?: string;
  menus?: Array<MenuResult>;
  cTime?: Date;
}
