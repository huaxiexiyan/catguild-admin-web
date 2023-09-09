import type { MenuPageParam, MenuPageResult, MenuParam, MenuTreeResult } from '@/api/system/model/menuModel';
import { ACTIVE_STATUS } from '@/constants';
import { request } from '@/utils/request';

const Api = {
  Menu: '/auth/menus',
  MenuTree: '/auth/menus/tree',
};
// 获取分页列表
export function getMenuPage(params: MenuPageParam) {
  return request.get<MenuPageResult>({
    url: Api.Menu,
    params,
  });
}
// 新增信息
export function addMenu(data: MenuParam) {
  return request.post({
    url: Api.Menu,
    data,
  });
}
// 编辑信息
export function updateMenu(id: number, data: MenuParam) {
  return request.put({
    url: `Api.Menu/${id}`,
    data,
  });
}
// 修改状态
export function updateMenuStatus(id: number, status: ACTIVE_STATUS) {
  return request.patch({
    url: `Api.Menu/${id}`,
    data: { status },
  });
}
// 删除信息
export function removeMenu(id: number) {
  return request.delete({
    url: `Api.Menu/${id}`,
  });
}
// 获取菜单树
export function getMenuTree(params?: MenuPageParam) {
  return request.get<MenuTreeResult>({
    url: Api.MenuTree,
    params,
  });
}
