import { ACTIVE_STATUS, PageParam, PageResult } from '@/constants';

export interface SaveAppAuthConfigParam {
  id: string;
  ids: string[];
  appAuthType: AppAuthTypeResult;
  accessToken: number;
  refreshToken: string;
  expiresIn: string;
  lastUpdateAccessTokenTime: Date;
  lastUpdateRefreshTokenTime: Date;
  activeStatus: ACTIVE_STATUS;
  status: APP_AUTH_CONFIG_STATUS;
}

export interface AppAuthConfigPageParam extends PageParam {
  name: string;
  activeStatus: ACTIVE_STATUS;
  status: APP_AUTH_CONFIG_STATUS;
}

export interface AppAuthConfigPageResult extends PageResult {
  records: Array<AppAuthConfigResult>;
}

export interface AppAuthConfigResult {
  id: string;
  appAuthType: AppAuthTypeResult;
  accessToken: number;
  refreshToken: string;
  expiresIn: string;
  lastUpdateAccessTokenTime: Date;
  lastUpdateRefreshTokenTime: Date;
  activeStatus: ACTIVE_STATUS;
  status: APP_AUTH_CONFIG_STATUS;
}
export interface AppAuthTypeResult {
  id: string;
  name: string;
}

export enum APP_AUTH_CONFIG_STATUS {
  NORMAL = 'NORMAL',
  OVERDUE = 'OVERDUE',
}

export const APP_AUTH_CONFIG_STATUS_LABEL = {
  NORMAL: '正常',
  OVERDUE: '已过期',
};

export const APP_AUTH_CONFIG_STATUS_OPTIONS = [
  { label: APP_AUTH_CONFIG_STATUS_LABEL.NORMAL, value: APP_AUTH_CONFIG_STATUS.NORMAL },
  { label: APP_AUTH_CONFIG_STATUS_LABEL.OVERDUE, value: APP_AUTH_CONFIG_STATUS.OVERDUE },
];
