import { FormRule } from 'tdesign-vue-next';

export const addMenuRules: Record<string, FormRule[]> = {
  path: [{ required: true, message: '请输入路由' }],
  name: [{ required: true, message: '请输入路由名' }],
  component: [{ required: true, message: '请输入组件位置' }],
  'meta.title': [{ required: true, message: '请输入菜单名称', type: 'error' }],
};

export const RESOURCE_DATA = {
  name: '',
};

export const RESOURCE_INFO_DATA = {
  parentId: undefined as string | undefined,
  path: '',
  name: '',
  component: '',
  redirect: '',
  meta: {
    // meta 主要用途是路由在菜单上展示的效果的配置
    title: '', // 该路由在菜单上展示的标题
    icon: '', // 该路由在菜单上展示的图标
    expanded: false, // 决定该路由在菜单上是否默认展开
    orderNo: 0, // 该路由在菜单上展示先后顺序，数字越小越靠前，默认为零
    hidden: false, // 决定该路由是否在菜单上进行展示
    hiddenBreadcrumb: false, // 如果启用了面包屑，决定该路由是否在面包屑上进行展示
    single: false, // 如果是多级菜单且只存在一个节点，想在菜单上只展示一级节点，可以使用该配置。请注意该配置需配置在父节点
    frameSrc: '', // 内嵌 iframe 的地址
    frameBlank: true, // 内嵌 iframe 的地址是否以新窗口打开
    keepAlive: true, // 可决定路由是否开启keep-alive，默认开启。
  },
};
