import type { AppPageParam, AppPageResult, AppParam, AppResult } from '@/api/system/model/appModel';
import { request } from '@/utils/request';

const Api = {
  App: '/system/apps',
};
// 获取应用列表
export function getAppPage(params: AppPageParam) {
  return request.get<AppPageResult>({
    url: Api.App,
    params,
  });
}
// 修改应用状态
export function getAppTree() {
  return request.get<AppPageResult>({
    url: `${Api.App}/tree`,
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
export function updateApp(id: string, data: AppParam) {
  return request.put({
    url: `${Api.App}/${id}`,
    data,
  });
}
// 修改应用状态
export function updateAppActiveStatus(id: string) {
  return request.patch({
    url: `${Api.App}/${id}/active-status`,
  });
}

export function getMainApp() {
  return request.get<Array<AppResult>>({
    url: `${Api.App}/main-apps`,
  });
}
