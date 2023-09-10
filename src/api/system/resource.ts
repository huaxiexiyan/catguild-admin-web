import type {
  ResourcePageParam,
  ResourcePageResult,
  ResourceParam,
  ResourceResult,
} from '@/api/system/model/resourceModel';
import { ACTIVE_STATUS } from '@/constants';
import { request } from '@/utils/request';

const Api = {
  Resources: '/auth/resources',
};
// 获取分页列表
export function getResourcePage(params: ResourcePageParam) {
  return request.get<ResourcePageResult>({
    url: Api.Resources,
    params,
  });
}
// 新增信息
export function addResource(data: ResourceParam) {
  return request.post<ResourceResult>({
    url: Api.Resources,
    data,
  });
}
// 编辑信息
export function updateResource(id: string, data: ResourceParam) {
  return request.put({
    url: `${Api.Resources}/${id}`,
    data,
  });
}
// 修改状态
export function updateResourceStatus(id: string, status: ACTIVE_STATUS) {
  return request.patch({
    url: `${Api.Resources}/${id}/status`,
    data: { status },
  });
}
// 删除信息
export function removeResource(id: string) {
  return request.delete({
    url: `${Api.Resources}/${id}`,
  });
}
