<template>
  <t-drawer header="标题名称" :on-confirm="handleClose" @close="handleClose">
    <t-space direction="vertical" size="large" style="width: 100%">
      <t-space direction="vertical" :size="0" style="width: 100%">
        <span>标签 A</span>
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
import { ref } from 'vue';
// 通知调用方，关闭抽屉了
</script>

<style lang="less" scoped></style>
