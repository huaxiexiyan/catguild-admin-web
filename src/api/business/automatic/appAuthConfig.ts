import { request } from '@/utils/request';

import type {
  AppAuthConfigPageParam,
  AppAuthConfigPageResult,
  SaveAppAuthConfigParam,
} from './model/appAuthConfigModel';

const Api = {
  AppAuthConfig: '/business/automatic/app-auth-config',
};
// 获取分页列表
export function getAppAuthConfigPage(params: AppAuthConfigPageParam) {
  return request.get<AppAuthConfigPageResult>({
    url: Api.AppAuthConfig,
    params,
  });
}

export function addAppAuthConfig(data: SaveAppAuthConfigParam) {
  return request.post({
    url: Api.AppAuthConfig,
    data,
  });
}

export function updateAppAuthConfig(data: SaveAppAuthConfigParam) {
  return request.patch({
    url: `${Api.AppAuthConfig}/${data.id}`,
    data,
  });
}

export function updateAppAuthConfigActiveStatus(data: SaveAppAuthConfigParam) {
  return request.patch({
    url: `${Api.AppAuthConfig}/${data.id}/active-status`,
    data,
  });
}

export function clearAppAuthConfigToken(data: SaveAppAuthConfigParam) {
  return request.patch({
    url: `${Api.AppAuthConfig}/clear-token`,
    data,
  });
}
