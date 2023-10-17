<template>
  <t-dialog
    v-model:visible="formVisible"
    :header="fatherProps.isAddMenu == true ? '新增菜单' : '更新菜单'"
    :width="680"
    :footer="false"
  >
    <template #body>
      <t-form
        ref="addMenuValidatorStatus"
        :data="menuformData"
        :rules="addMenuRules"
        :label-width="100"
        :status-icon="true"
        @submit="onSubmitMenu"
      >
        <t-form-item
          label="路由"
          name="path"
          help="是当前路由的路径，会与配置中的父级节点的 path 组成该页面路由的最终路径"
        >
          <t-input v-model="menuformData.path" placeholder="当前路由的路径" />
        </t-form-item>
        <t-form-item
          label="路由名"
          name="name"
          help="多标签 Tab 页，如果要确保页面有 keep-alive 的能力，需要和对应页面（SFC)的name保持一致"
        >
          <t-input v-model="menuformData.name" placeholder="路由的name" />
        </t-form-item>
        <t-form-item label="组件位置" name="component">
          <t-input v-model="menuformData.component" placeholder="渲染该路由时使用的页面组件" />
        </t-form-item>
        <t-form-item label="重定向" name="redirect">
          <t-input v-model="menuformData.redirect" placeholder="重定向的路径" />
        </t-form-item>
        <t-form-item label="活跃状态" name="activeStatus">
          <t-switch
            v-model="menuformData.activeStatus"
            :custom-value="[ACTIVE_STATUS.ACTIVE, ACTIVE_STATUS.INACTIVE]"
            :label="[ACTIVE_STATUS_LABEL.ACTIVE, ACTIVE_STATUS_LABEL.INACTIVE]"
            size="large"
          >
          </t-switch>
        </t-form-item>
        <t-form-item label="父路由" name="parentId">
          <t-tree-select
            v-model="menuformData.parentMenu.id"
            style="display: inline-block; margin: 0 5px 5px 0"
            :data="menuTreeData"
            clearable
            filterable
            placeholder="-请选择父路由-"
            @click="loadingMenuTree"
          />
        </t-form-item>
        <t-divider>路由在菜单上展示的效果的配置</t-divider>
        <t-form-item label="标题" name="meta.title">
          <t-input v-model="menuformData.meta.title" placeholder="该路由在菜单上展示的标题" />
        </t-form-item>
        <t-form-item label="图标" name="meta.icon">
          <t-input v-model="menuformData.meta.icon" placeholder="该路由在菜单上展示的图标" />
        </t-form-item>
        <t-form-item label="排序" name="meta.orderNo">
          <t-input-number
            v-model="menuformData.meta.orderNo"
            theme="normal"
            :min="0"
            :style="{ width: '580px' }"
            placeholder="该路由在菜单上展示先后顺序，数字越小越靠前，默认为零"
          />
        </t-form-item>
        <t-form-item label="iframe地址" name="meta.frameSrc">
          <t-input v-model="menuformData.meta.frameSrc" placeholder="请输入内嵌 iframe 的地址" />
        </t-form-item>
        <t-row justify="center">
          <t-col :span="5">
            <t-form-item label-width="170px" label="iframe是否新窗口打开" name="meta.frameBlank">
              <t-switch
                v-model="menuformData.meta.frameBlank"
                :label="[YES_NO_STATUS_LABEL.YES, YES_NO_STATUS_LABEL.NO]"
                size="large"
              >
              </t-switch> </t-form-item
          ></t-col>
          <t-col :span="5">
            <t-form-item label-width="170px" label="是否默认展开" name="meta.expanded">
              <t-switch
                v-model="menuformData.meta.expanded"
                :label="[YES_NO_STATUS_LABEL.YES, YES_NO_STATUS_LABEL.NO]"
                size="large"
              >
              </t-switch> </t-form-item
          ></t-col>
        </t-row>
        <t-row justify="center">
          <t-col :span="5">
            <t-form-item label-width="170px" label="是否隐藏" name="meta.hidden">
              <t-switch
                v-model="menuformData.meta.hidden"
                :label="[YES_NO_STATUS_LABEL.YES, YES_NO_STATUS_LABEL.NO]"
                size="large"
              >
              </t-switch>
            </t-form-item>
          </t-col>
          <t-col :span="5">
            <t-form-item label-width="170px" label="是否隐藏面包屑" name="meta.hiddenBreadcrumb">
              <t-switch
                v-model="menuformData.meta.hiddenBreadcrumb"
                :label="[YES_NO_STATUS_LABEL.YES, YES_NO_STATUS_LABEL.NO]"
                size="large"
              >
              </t-switch> </t-form-item
          ></t-col>
        </t-row>
        <t-row justify="center">
          <t-col :span="5">
            <t-form-item label-width="170px" label="是否单节点" name="meta.single">
              <t-switch
                v-model="menuformData.meta.single"
                :label="[YES_NO_STATUS_LABEL.YES, YES_NO_STATUS_LABEL.NO]"
                size="large"
              >
              </t-switch>
            </t-form-item>
          </t-col>
          <t-col :span="5">
            <t-form-item label-width="170px" label="是否开启keep-alive" name="meta.keepAlive">
              <t-switch
                v-model="menuformData.meta.keepAlive"
                :label="[YES_NO_STATUS_LABEL.YES, YES_NO_STATUS_LABEL.NO]"
                size="large"
              >
              </t-switch>
            </t-form-item>
          </t-col>
        </t-row>
        <t-row justify="end">
          <t-col :span="5">
            <t-form-item>
              <t-button variant="outline" @click="closeDialog">取消</t-button>
              <t-button theme="primary" type="submit">确定</t-button>
            </t-form-item>
          </t-col>
        </t-row>
      </t-form>
    </template>
  </t-dialog>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { addMenu, getMenu, getMenuTree } from '@/api/system/menu';
import { MenuParam } from '@/api/system/model/menuModel';
import { ACTIVE_STATUS, ACTIVE_STATUS_LABEL, YES_NO_STATUS_LABEL } from '@/constants';

import { addMenuRules } from './addMenuConstants';

// 传值父组件
const $emit = defineEmits(['closeAddMenuDialog']);
// 父组件传值
const fatherProps = defineProps({
  isAddMenu: {
    type: Boolean,
    default: true,
  },
  updateMenuId: {
    type: String,
    default: '',
  },
});
// 数据结构定义
const addMenuValidatorStatus = ref(null);
const formVisible = ref(false);
const menuTreeData = ref();
const INITIAL_DATA: MenuParam = {
  id: undefined as string | undefined,
  parentMenu: {
    id: undefined as string | undefined,
  },
  path: '',
  name: '',
  component: '',
  redirect: undefined as string | undefined,
  activeStatus: ACTIVE_STATUS.ACTIVE,
  meta: {
    // meta 主要用途是路由在菜单上展示的效果的配置
    title: '', // 该路由在菜单上展示的标题
    icon: undefined as string | undefined, // 该路由在菜单上展示的图标
    expanded: false, // 决定该路由在菜单上是否默认展开
    orderNo: 0, // 该路由在菜单上展示先后顺序，数字越小越靠前，默认为零
    hidden: false, // 决定该路由是否在菜单上进行展示
    hiddenBreadcrumb: false, // 如果启用了面包屑，决定该路由是否在面包屑上进行展示
    single: false, // 如果是多级菜单且只存在一个节点，想在菜单上只展示一级节点，可以使用该配置。请注意该配置需配置在父节点
    frameSrc: undefined as string | undefined, // 内嵌 iframe 的地址
    frameBlank: true, // 内嵌 iframe 的地址是否以新窗口打开
    keepAlive: true, // 可决定路由是否开启keep-alive，默认开启。
  },
};
const menuformData = ref({ ...INITIAL_DATA });
// 提交表单
const onSubmitMenu = async ({ validateResult, firstError }) => {
  if (validateResult === true) {
    await addMenu(menuformData.value);
    closeDialog();
  }
};

// 更新菜单回显
const updateMenuEcho = async () => {
  menuformData.value = await getMenu(fatherProps.updateMenuId);
};

// 更新菜单初始化
onMounted(() => {
  if (!fatherProps.isAddMenu) {
    updateMenuEcho();
  }
});

// 清除校验结果
const handleClear = () => {
  addMenuValidatorStatus.value.clearValidate();
};

// 添加弹框取消
const closeDialog = () => {
  handleClear();
  closeAddAppDialog();
};

const closeAddAppDialog = () => {
  $emit('closeAddMenuDialog', false);
};

// 加载菜单树
const loadingMenuTree = async () => {
  const menuTree = await getMenuTree();
  menuTreeData.value = menuTree;
};
</script>
./saveMenuConstants
