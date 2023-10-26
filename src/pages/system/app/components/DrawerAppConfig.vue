<template>
  <t-drawer header="标题名称" :on-confirm="handleConfirm" @close="closeDrawerAppConfig">
    <t-space direction="vertical" size="large" style="width: 100%">
      <t-space direction="vertical" :size="0" style="width: 100%">
        <span>配置菜单</span>
        <t-space>
          <t-button theme="primary" @click="selectInvert">反选</t-button>
        </t-space>
        <t-tree
          id="menuTree"
          ref="menuTreeRef"
          v-model="allCheckedMenuIds"
          :data="menuTreeData"
          checkable
          value-mode="all"
          hover
          expand-all
        />
        <t-loading attach="#menuTree" size="small" :loading="menuDataLoading" />
      </t-space>
      <t-space direction="vertical" :size="0" style="width: 100%">
        <span>标签 B</span>
        <t-input />
      </t-space>
      <t-space direction="vertical" :size="0" style="width: 100%">
        <span>标签 C</span>
        <t-input />
      </t-space>
    </t-space>
  </t-drawer>
</template>

<script setup lang="ts">
import { MessagePlugin } from 'tdesign-vue-next';
import { onMounted, ref } from 'vue';

import { getApp, updateAppMenu } from '@/api/system/app';
import { getMenuTree } from '@/api/system/menu';
import { AppResult } from '@/api/system/model/appModel';
import { MenuResult } from '@/api/system/model/menuModel';

const fatherProps = defineProps({
  drawerAppId: {
    type: String,
  },
});
// 通知调用方，关闭抽屉了
const handleConfirm = () => {
  console.log(`选择了菜单id=${allCheckedMenuIds.value}`);
  const updateAppMenuData: AppResult = {};
  const menuData: Array<MenuResult> = [];
  updateAppMenuData.id = fatherProps.drawerAppId;
  allCheckedMenuIds.value.forEach((menuId) => {
    menuData.push({ id: menuId });
  });
  updateAppMenuData.menus = menuData;
  updateAppMenu(fatherProps.drawerAppId, updateAppMenuData).then(() => {
    MessagePlugin.success('更新配置成功');
    closeDrawerAppConfig();
  });
};

// 传值父组件
const $emit = defineEmits(['closeDrawerAppConfig']);
const closeDrawerAppConfig = () => {
  $emit('closeDrawerAppConfig', false);
};

// 初始化
onMounted(() => {
  menuDataLoading.value = true;
  loadAppData().then(() => {
    loadMenuTreeData().then(() => {
      // 处理菜单树的默认选择问题
      if (appData.value.menus) {
        const defaultCheckedMenuIds: any[] = [];
        appData.value.menus.forEach((menu) => {
          defaultCheckedMenuIds.push(menu.id);
        });
        allCheckedMenuIds.value = defaultCheckedMenuIds;
      }
    });
  });
  menuDataLoading.value = false;
});

const appData = ref();
const menuDataLoading = ref(false);
const loadAppData = async () => {
  if (fatherProps.drawerAppId) {
    await getApp(fatherProps.drawerAppId).then((data) => {
      appData.value = data;
    });
  }
};

// 加载菜单配置
const menuTreeRef = ref();
const menuTreeData = ref();
const allCheckedMenuIds = ref([]);
const loadMenuTreeData = async () => {
  if (appData.value.parentApp === null || appData.value.parentApp.id === null || appData.value.parentApp.id === '0') {
    await getMenuTree().then((data) => {
      menuTreeData.value = data;
    });
  } else {
    // 加载父APP的菜单
    await getApp(appData.value.parentApp.id).then((data) => {
      menuTreeData.value = data.menus;
    });
  }
};
const selectInvert = () => {
  // 取得所有节点
  const items = menuTreeRef.value.getItems();
  const revertSelection: any[] = [];
  items.forEach((item: { checked: any; indeterminate: any; value: any }) => {
    if (!item.checked && !item.indeterminate) {
      // checked 为 true, 为直接选中状态
      // indeterminate 为 true, 为半选状态
      revertSelection.push(item.value);
    }
  });
  allCheckedMenuIds.value = revertSelection;
};
</script>

<style lang="less" scoped></style>
