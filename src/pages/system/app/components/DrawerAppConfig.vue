<template>
  <t-drawer header="标题名称" :on-confirm="handleConfirm" @close="closeDrawerAppConfig">
    <t-space direction="vertical" size="large" style="width: 100%">
      <t-space direction="vertical" :size="0" style="width: 100%">
        <span>配置菜单</span>
        <t-input />
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
});
</script>

<style lang="less" scoped></style>
