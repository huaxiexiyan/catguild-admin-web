import type {
  ResourcePageParam,
  ResourcePageResult,
  ResourceParam,
  ResourceResult,
} from '@/api/system/model/resourceModel';
import { ACTIVE_STATUS } from '@/constants';
import { request } from '@/utils/request';

const Api = {
  App: '/auth/resources',
};
// 获取分页列表
export function getResourcePage(params: ResourcePageParam) {
  return request.get<ResourcePageResult>({
    url: Api.App,
    params,
  });
}
// 新增信息
export function addResource(data: ResourceParam) {
  return request.post<ResourceResult>({
    url: Api.App,
    data,
  });
}
// 编辑信息
export function updateResource(id: number, data: ResourceParam) {
  return request.put({
    url: `Api.App/${id}`,
    data,
  });
}
// 修改状态
export function updateResourceStatus(id: number, status: ACTIVE_STATUS) {
  return request.patch({
    url: `Api.App/${id}`,
    data: { status },
  });
}
// 删除信息
export function removeResource(id: number) {
  return request.delete({
    url: `Api.App/${id}`,
  });
}
