import type {
  AppPageParam,
  AppPageResult,
  AppParam,
  AppVersionListResult,
  AppVersionParam,
} from '@/api/system/model/appModel';
import { ACTIVE_STATUS } from '@/constants';
import { request } from '@/utils/request';

const Api = {
  App: '/auth/apps',
};
// 获取应用列表
export function getAppPage(params: AppPageParam) {
  return request.get<AppPageResult>({
    url: Api.App,
    params,
  });
}
// 新增应用信息
export function addApp(data: AppParam) {
  return request.post({
    url: Api.App,
    data,
  });
}
// 编辑应用信息
export function updateApp(id: number, data: AppParam) {
  return request.put({
    url: `Api.App/${id}`,
    data,
  });
}
// 修改应用状态
export function updateAppStatus(id: number, status: ACTIVE_STATUS) {
  return request.patch({
    url: `Api.App/${id}`,
    data: { status },
  });
}
// 删除应用信息
export function removeApp(id: number) {
  return request.delete({
    url: `Api.App/${id}`,
  });
}

// 获取应用版本列表
export function getAppVersion(id: number) {
  return request.get<AppVersionListResult>({
    url: `Api.App/${id}/versions`,
  });
}
// 新增应用版本信息
export function addAppVersion(id: number, data: AppVersionParam) {
  return request.post({
    url: `Api.App/${id}/versions`,
    data,
  });
}
// 编辑应用版本信息
export function updateAppVersion(id: number, versionId: number, data: AppVersionParam) {
  return request.put({
    url: `Api.App/${id}/versions/${versionId}`,
    data,
  });
}
// 修改应用版本状态
export function updateAppVersionStatus(id: number, versionId: number, status: ACTIVE_STATUS) {
  return request.patch({
    url: `Api.App/${id}/versions/${versionId}`,
    data: { status },
  });
}
// 删除应用版本信息
export function removeAppVersion(id: number, versionId: number) {
  return request.delete({
    url: `Api.App/${id}/versions/${versionId}`,
  });
}
