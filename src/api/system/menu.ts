import type { MenuPageParam, MenuParam, MenuResult, MenuTreeListResult } from '@/api/system/model/menuModel';
import { ACTIVE_STATUS } from '@/constants';
import { request } from '@/utils/request';

const Api = {
  Menu: '/system/menus',
};
// 获取分页列表
// 新增信息
export function addMenu(data: MenuParam) {
  return request.post({
    url: Api.Menu,
    data,
  });
}
// 详情
export function getMenu(id: string) {
  return request.get<MenuResult>({
    url: `Api.Menu/${id}`,
  });
}
// 编辑信息
export function updateMenu(id: string, data: MenuParam) {
  return request.put({
    url: `Api.Menu/${id}`,
    data,
  });
}
// 修改状态
export function updateMenuStatus(id: string, status: ACTIVE_STATUS) {
  return request.patch({
    url: `Api.Menu/${id}`,
    data: { status },
  });
}
// 删除信息
export function removeMenu(id: string) {
  return request.delete({
    url: `Api.Menu/${id}`,
  });
}
// 获取菜单树
export function getMenuTree(params?: MenuPageParam) {
  return request.get<MenuTreeListResult>({
    url: `${Api.Menu}/tree`,
    params,
  });
}
