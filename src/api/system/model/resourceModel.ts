import { ACTIVE_STATUS, PageParam, PageResult } from '@/constants';

// 分页请求参数
export interface ResourcePageParam extends PageParam {
  id: number;
  name: string;
  type: RESOURCE_TYPE;
  status: ACTIVE_STATUS;
}

export interface ResourcePageResult extends PageResult {
  records: Array<ResourceResult>;
}

// 请求参数
export interface ResourceParam {
  name: string;
  type?: RESOURCE_TYPE;
}

// 返回参数
export interface ResourceResult {
  id: string;
  name: string;
  type: RESOURCE_TYPE;
  status: ACTIVE_STATUS;
  cTime: Date;
}

export enum RESOURCE_TYPE {
  MENU = 'MENU',
  BUTTON = 'BUTTON',
}

export const RESOURCE_TYPE_LABEL = {
  MENU: '菜单',
  BUTTON: '按钮',
};

export const RESOURCE_TYPE_OPTIONS = [
  { label: RESOURCE_TYPE_LABEL.MENU, value: 'MENU' },
  { label: RESOURCE_TYPE_LABEL.BUTTON, value: '按钮' },
];
