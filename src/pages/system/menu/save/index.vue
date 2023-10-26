<template>
  <t-form
    ref="saveMenuFormRef"
    class="base-form"
    :data="menuformData"
    :rules="saveMenuRules"
    label-align="top"
    :label-width="100"
    :status-icon="true"
    @submit="onSubmitMenu"
  >
    <div class="form-basic-container">
      <div class="form-basic-item">
        <div class="form-basic-container-title">菜单组件信息</div>
        <t-row class="row-gap" :gutter="[32, 24]">
          <t-col :span="6">
            <t-form-item
              label="路由"
              name="path"
              help="是当前路由的路径，会与配置中的父级节点的 path 组成该页面路由的最终路径"
            >
              <t-input v-model="menuformData.path" placeholder="当前路由的路径" />
            </t-form-item>
          </t-col>
          <t-col :span="6">
            <t-form-item
              label="路由名"
              name="name"
              help="多标签 Tab 页，如果要确保页面有 keep-alive 的能力，需要和对应页面（SFC)的name保持一致"
            >
              <t-input v-model="menuformData.name" placeholder="路由的name" />
            </t-form-item>
          </t-col>
          <t-col :span="6">
            <t-form-item label="组件位置" name="component">
              <t-input v-model="menuformData.component" placeholder="渲染该路由时使用的页面组件" />
            </t-form-item>
          </t-col>
          <t-col :span="6">
            <t-form-item label="重定向" name="redirect">
              <t-input v-model="menuformData.redirect" placeholder="重定向的路径" />
            </t-form-item>
          </t-col>
          <t-col :span="6">
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
          </t-col>
          <t-col :span="6">
            <t-form-item label="活跃状态" name="activeStatus">
              <t-switch
                v-model="menuformData.activeStatus"
                :custom-value="[ACTIVE_STATUS.ACTIVE, ACTIVE_STATUS.INACTIVE]"
                :label="[ACTIVE_STATUS_LABEL.ACTIVE, ACTIVE_STATUS_LABEL.INACTIVE]"
                size="large"
              >
              </t-switch>
            </t-form-item>
          </t-col>
        </t-row>
        <div class="form-basic-container-title form-title-gap">路由在菜单上展示的效果的配置</div>
        <t-row class="row-gap" :gutter="[32, 24]">
          <t-col :span="6"
            ><t-form-item label="标题" name="meta.title">
              <t-input v-model="menuformData.meta.title" placeholder="该路由在菜单上展示的标题" /> </t-form-item
          ></t-col>
          <t-col :span="6"
            ><t-form-item label="图标" name="meta.icon">
              <t-input v-model="menuformData.meta.icon" placeholder="该路由在菜单上展示的图标" /> </t-form-item
          ></t-col>
          <t-col :span="6"
            ><t-form-item label="排序" name="meta.orderNo">
              <t-input-number
                v-model="menuformData.meta.orderNo"
                theme="normal"
                :min="0"
                :style="{ width: '580px' }"
                placeholder="该路由在菜单上展示先后顺序，数字越小越靠前，默认为零"
              /> </t-form-item
          ></t-col>
          <t-col :span="6">
            <t-form-item label="iframe地址" name="meta.frameSrc">
              <t-input v-model="menuformData.meta.frameSrc" placeholder="请输入内嵌 iframe 的地址" /> </t-form-item
          ></t-col>
          <t-col :span="6">
            <t-form-item label-width="170px" label="iframe是否新窗口打开" name="meta.frameBlank">
              <t-switch
                v-model="menuformData.meta.frameBlank"
                :label="[YES_NO_STATUS_LABEL.YES, YES_NO_STATUS_LABEL.NO]"
                size="large"
              /> </t-form-item
          ></t-col>
          <t-col :span="6">
            <t-form-item label-width="170px" label="是否默认展开" name="meta.expanded">
              <t-switch
                v-model="menuformData.meta.expanded"
                :label="[YES_NO_STATUS_LABEL.YES, YES_NO_STATUS_LABEL.NO]"
                size="large"
              /> </t-form-item
          ></t-col>
          <t-col :span="6">
            <t-form-item label-width="170px" label="是否隐藏" name="meta.hidden">
              <t-switch
                v-model="menuformData.meta.hidden"
                :label="[YES_NO_STATUS_LABEL.YES, YES_NO_STATUS_LABEL.NO]"
                size="large"
              />
            </t-form-item>
          </t-col>
          <t-col :span="6">
            <t-form-item label-width="170px" label="是否隐藏面包屑" name="meta.hiddenBreadcrumb">
              <t-switch
                v-model="menuformData.meta.hiddenBreadcrumb"
                :label="[YES_NO_STATUS_LABEL.YES, YES_NO_STATUS_LABEL.NO]"
                size="large"
              /> </t-form-item
          ></t-col>
          <t-col :span="6">
            <t-form-item label-width="170px" label="是否单节点" name="meta.single">
              <t-switch
                v-model="menuformData.meta.single"
                :label="[YES_NO_STATUS_LABEL.YES, YES_NO_STATUS_LABEL.NO]"
                size="large"
              />
            </t-form-item>
          </t-col>
          <t-col :span="6">
            <t-form-item label-width="170px" label="是否开启keep-alive" name="meta.keepAlive">
              <t-switch
                v-model="menuformData.meta.keepAlive"
                :label="[YES_NO_STATUS_LABEL.YES, YES_NO_STATUS_LABEL.NO]"
                size="large"
              />
            </t-form-item>
          </t-col>
        </t-row>
      </div>
    </div>
    <div class="form-submit-container">
      <div class="form-submit-sub">
        <div class="form-submit-left">
          <t-button theme="primary" class="form-submit-confirm" type="submit"> 确认提交 </t-button>
          <t-button type="button" class="form-submit-cancel" theme="default" variant="base" @click="handleCancel">
            取消
          </t-button>
        </div>
      </div>
    </div>
  </t-form>
</template>
<script lang="ts">
export default {
  name: 'SystemMenuSave',
};
</script>
<script setup lang="ts">
import { MessagePlugin } from 'tdesign-vue-next';
import { onActivated, onDeactivated, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { addMenu, getMenu, getMenuTree } from '@/api/system/menu';
import { MenuParam } from '@/api/system/model/menuModel';
import { ACTIVE_STATUS, ACTIVE_STATUS_LABEL, YES_NO_STATUS_LABEL } from '@/constants';

import { saveMenuRules } from './saveMenuConstants';

const router = useRouter();
const route = useRoute();

// 数据结构定义
const saveMenuFormRef = ref(null);
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
    await addMenu(menuformData.value).then(() => {
      MessagePlugin.success('添加成功');
      goBack();
    });
  }
};

// 更新菜单回显
const updateMenuEcho = async (id: string) => {
  await getMenu(id).then((data) => {
    if (data) {
      menuformData.value = data;
      if (menuformData.value.parentMenu.id === '0') {
        menuformData.value.parentMenu.id = undefined;
      }
    }
  });
};

const initFromData = () => {
  saveMenuFormRef.value.reset();
  menuformData.value.id = undefined;
  menuformData.value.parentMenu.id = undefined;
  menuformData.value.path = '';
  menuformData.value.name = '';
  menuformData.value.component = '';
  menuformData.value.redirect = undefined;
  menuformData.value.activeStatus = ACTIVE_STATUS.ACTIVE;
  menuformData.value.meta.title = '';
  menuformData.value.meta.icon = undefined;
  menuformData.value.meta.expanded = false;
  menuformData.value.meta.orderNo = 0;
  menuformData.value.meta.hidden = false;
  menuformData.value.meta.hiddenBreadcrumb = false;
  menuformData.value.meta.single = false;
  menuformData.value.meta.frameSrc = undefined;
  menuformData.value.meta.frameBlank = true;
  menuformData.value.meta.keepAlive = true;
};

// 更新菜单初始化
const init = () => {
  loadingMenuTree();
  if (route.query.parentId) {
    // 处理添加子菜单
    menuformData.value.parentMenu.id = route.query.parentId.toString();
  }
  if (route.query.id) {
    // 处理更新
    updateMenuEcho(route.query.id.toString());
  }
};

// 每次进入组件时执行
onActivated(() => {
  init();
});

// 每次离开组件后执行
onDeactivated(() => {
  initFromData();
});

onMounted(() => {
  init();
});

// 添加返回
const goBack = () => {
  router.back();
};

const handleCancel = () => {
  goBack();
};

// 加载菜单树
const loadingMenuTree = async () => {
  const menuTree = await getMenuTree();
  menuTreeData.value = menuTree;
};
</script>

<style lang="less" scoped>
.form-basic-container {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--td-bg-color-container);
  border-radius: var(--td-radius-medium) var(--td-radius-medium) 0 0;
  padding: var(--td-comp-paddingTB-xxl) var(--td-comp-paddingLR-xxl) 80px var(--td-comp-paddingLR-xxl);

  @media (max-width: @screen-sm-max) {
    padding: var(--td-comp-paddingTB-xl) var(--td-comp-paddingLR-xl) 80px var(--td-comp-paddingLR-xl);

    .form-basic-container-title {
      margin: 0 0 var(--td-comp-margin-xxxl) 0;
    }
  }

  .form-basic-item {
    width: 676px;

    .form-basic-container-title {
      font: var(--td-font-title-large);
      font-weight: 400;
      color: var(--td-text-color-primary);
      margin: var(--td-comp-margin-xxl) 0 var(--td-comp-margin-xl) 0;
    }

    .form-title-gap {
      margin: calc(var(--td-comp-margin-xxl) * 2) 0 var(--td-comp-margin-xl) 0;
    }
  }
}

.form-submit-container {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: var(--td-comp-paddingLR-xl);
  padding-bottom: var(--td-comp-paddingLR-xl);
  background-color: var(--td-bg-color-secondarycontainer);
  border-bottom-left-radius: var(--td-radius-medium);
  border-bottom-right-radius: var(--td-radius-medium);
  border-top: 1px solid var(--td-component-stroke);

  .form-submit-sub {
    width: 676px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .form-submit-left {
      .form-submit-upload-span {
        font-size: 14px;
        line-height: 22px;
        color: var(--td-text-color-placeholder);
        padding-top: 8px;
        display: inline-block;
      }
    }
  }
}
</style>
