<template>
  <t-drawer header="标题名称" :on-confirm="handleConfirm" @close="closeDrawerAppConfig">
    <t-space direction="vertical" size="large" style="width: 100%">
      <t-space direction="vertical" :size="0" style="width: 100%">
        <span>配置菜单</span>
        <t-space>
          <t-button theme="primary" @click="selectInvert">反选</t-button>
        </t-space>
        <t-tree
          ref="menuTreeRef"
          v-model="allCheckedMenuIds"
          :data="menuTreeData"
          checkable
          value-mode="all"
          hover
          expand-all
        />
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
import { onMounted, ref } from 'vue';

import { getMenuTree } from '@/api/system/menu';
// 通知调用方，关闭抽屉了
const handleConfirm = () => {
  closeDrawerAppConfig();
};

// 传值父组件
const $emit = defineEmits(['closeDrawerAppConfig']);
const closeDrawerAppConfig = () => {
  $emit('closeDrawerAppConfig', false);
};

// 初始化
onMounted(() => {
  console.log('抽屉初始化');
  loadMenuTreeData();
});

// 加载菜单配置
const menuTreeRef = ref();
const menuTreeData = ref();
const allCheckedMenuIds = ref([]);
const loadMenuTreeData = async () => {
  await getMenuTree().then((data) => {
    menuTreeData.value = data;
  });
};
const selectInvert = () => {
  const { tree } = menuTreeRef.value;
  // 取得所有节点
  const items = tree.getItems();
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
