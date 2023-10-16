import { ACTIVE_STATUS, PageParam } from '@/constants';

// 分页请求参数
export interface MenuPageParam extends PageParam {
  id: string;
  name: string;
  type: MENU_TYPE;
  status: ACTIVE_STATUS;
}

export interface MenuTreeListResult {
  records: Array<MenuResult>;
}

// 请求参数
export interface MenuParam {
  id: string;
  parentMenu: {
    id: string;
  };
  path: string;
  name: string;
  component: string;
  redirect: string;
  activeStatus: ACTIVE_STATUS;
  meta: {
    // meta 主要用途是路由在菜单上展示的效果的配置
    title: string; // 该路由在菜单上展示的标题
    icon: string; // 该路由在菜单上展示的图标
    expanded: boolean; // 决定该路由在菜单上是否默认展开
    orderNo: number; // 该路由在菜单上展示先后顺序，数字越小越靠前，默认为零
    hidden: boolean; // 决定该路由是否在菜单上进行展示
    hiddenBreadcrumb: boolean; // 如果启用了面包屑，决定该路由是否在面包屑上进行展示
    single: boolean; // 如果是多级菜单且只存在一个节点，想在菜单上只展示一级节点，可以使用该配置。请注意该配置需配置在父节点
    frameSrc: string; // 内嵌 iframe 的地址
    frameBlank: boolean; // 内嵌 iframe 的地址是否以新窗口打开
    keepAlive: boolean; // 可决定路由是否开启keep-alive，默认开启。
  };
}

// 返回参数
export interface MenuResult {
  id: string;
  parentMenu: {
    id: string;
  };
  path: string;
  name: string;
  component: string;
  redirect: string;
  activeStatus: ACTIVE_STATUS;
  meta: {
    // meta 主要用途是路由在菜单上展示的效果的配置
    title: string; // 该路由在菜单上展示的标题
    icon: string; // 该路由在菜单上展示的图标
    expanded: boolean; // 决定该路由在菜单上是否默认展开
    orderNo: number; // 该路由在菜单上展示先后顺序，数字越小越靠前，默认为零
    hidden: boolean; // 决定该路由是否在菜单上进行展示
    hiddenBreadcrumb: boolean; // 如果启用了面包屑，决定该路由是否在面包屑上进行展示
    single: boolean; // 如果是多级菜单且只存在一个节点，想在菜单上只展示一级节点，可以使用该配置。请注意该配置需配置在父节点
    frameSrc: string; // 内嵌 iframe 的地址
    frameBlank: boolean; // 内嵌 iframe 的地址是否以新窗口打开
    keepAlive: boolean; // 可决定路由是否开启keep-alive，默认开启。
  };
}

export interface MenuTreeResult {
  id: string;
  parentId: string;
  resourceId: string;
  path: string;
  name: string;
  component: string;
  redirect: string;
  meta: {
    // meta 主要用途是路由在菜单上展示的效果的配置
    title: string; // 该路由在菜单上展示的标题
    icon: string; // 该路由在菜单上展示的图标
    expanded: boolean; // 决定该路由在菜单上是否默认展开
    orderNo: number; // 该路由在菜单上展示先后顺序，数字越小越靠前，默认为零
    hidden: boolean; // 决定该路由是否在菜单上进行展示
    hiddenBreadcrumb: boolean; // 如果启用了面包屑，决定该路由是否在面包屑上进行展示
    single: boolean; // 如果是多级菜单且只存在一个节点，想在菜单上只展示一级节点，可以使用该配置。请注意该配置需配置在父节点
    frameSrc: string; // 内嵌 iframe 的地址
    frameBlank: boolean; // 内嵌 iframe 的地址是否以新窗口打开
    keepAlive: boolean; // 可决定路由是否开启keep-alive，默认开启。
  };
  children: MenuTreeResult;
}

export enum MENU_TYPE {
  MENU = 'MENU',
  BUTTON = 'BUTTON',
}

export const MENU_TYPE_LABEL = {
  MENU: '菜单',
  BUTTON: '按钮',
};

export const MENU_TYPE_STRING = {
  MENU: 'MENU',
  BUTTON: 'BUTTON',
};

export const MENU_TYPE_OPTIONS = [
  { label: MENU_TYPE_LABEL.MENU, value: MENU_TYPE_LABEL.MENU },
  { label: MENU_TYPE_LABEL.BUTTON, value: MENU_TYPE_LABEL.BUTTON },
];
