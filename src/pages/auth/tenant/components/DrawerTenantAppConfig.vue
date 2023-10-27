<template>
  <t-drawer header="配置APP" :on-confirm="handleConfirm" @close="closeDrawerAppConfig">
    <t-space direction="vertical" size="large" style="width: 100%">
      <t-space direction="vertical" :size="0" style="width: 100%">
        <span>配置APP</span>
        <t-space>
          <t-button theme="primary" @click="selectInvert">反选</t-button>
        </t-space>
        <t-tree
          id="appTree"
          ref="appTreeRef"
          v-model="allCheckedAppIds"
          :data="appTreeData"
          checkable
          value-mode="all"
          hover
          expand-all
        />
        <t-loading attach="#appTree" size="small" :loading="appDataLoading" />
      </t-space>
    </t-space>
  </t-drawer>
</template>

<script setup lang="ts">
import { MessagePlugin } from 'tdesign-vue-next';
import { onMounted, ref } from 'vue';

import { Tenant } from '@/api/auth/model/tenantModel';
import { getTenant, updateTenantAppConfig } from '@/api/auth/tenant';
import { getApp, getAppTree, updateAppMenu } from '@/api/system/app';
import { AppResult } from '@/api/system/model/appModel';

const fatherProps = defineProps({
  drawerTenantId: {
    type: String,
  },
});
// 通知调用方，关闭抽屉了
const handleConfirm = () => {
  const updateTenantData: Tenant = {};
  const checkData: Array<string> = [];
  updateTenantData.id = fatherProps.drawerTenantId;
  allCheckedAppIds.value.forEach((appId: string) => {
    checkData.push(appId);
  });
  updateTenantData.appIds = checkData;
  updateTenantAppConfig(updateTenantData.id, updateTenantData).then(() => {
    MessagePlugin.success('更新配置成功');
    closeDrawerAppConfig();
  });
};

// 传值父组件
const $emit = defineEmits(['closeDrawerTenantAppConfig']);
const closeDrawerAppConfig = () => {
  $emit('closeDrawerTenantAppConfig', false);
};

// 初始化
const appDataLoading = ref(false);
onMounted(() => {
  appDataLoading.value = true;
  loadTenantData().then(() => {
    loadAppTreeData().then(() => {
      // 处理菜单树的默认选择问题
      if (tenantData.value.appIds) {
        const defaultCheckedMenuIds: any[] = [];
        tenantData.value.appIds.forEach((appId) => {
          defaultCheckedMenuIds.push(appId);
        });
        allCheckedAppIds.value = defaultCheckedMenuIds;
      }
    });
  });
  appDataLoading.value = false;
});

const tenantData = ref();
const loadTenantData = async () => {
  if (fatherProps.drawerTenantId) {
    await getTenant(fatherProps.drawerTenantId).then((data) => {
      tenantData.value = data;
    });
  }
};

// 加载菜单配置
const appTreeRef = ref();
const appTreeData = ref();
const allCheckedAppIds = ref([]);
const loadAppTreeData = async () => {
  await getAppTree().then((data) => {
    appTreeData.value = data;
  });
};
const selectInvert = () => {
  // 取得所有节点
  const items = appTreeRef.value.getItems();
  const revertSelection: any[] = [];
  items.forEach((item: { checked: any; indeterminate: any; value: any }) => {
    if (!item.checked && !item.indeterminate) {
      // checked 为 true, 为直接选中状态
      // indeterminate 为 true, 为半选状态
      revertSelection.push(item.value);
    }
  });
  allCheckedAppIds.value = revertSelection;
};
</script>

<style lang="less" scoped></style>
