<template>
  <div>
    <!-- 顶部 card  -->
    <!-- <top-panel class="row-container" /> -->
    <!-- 中部图表  -->
    <middle-chart class="row-container" />
  </div>
</template>
<script lang="ts">
export default {
  name: 'ERPOnlineBI',
};
</script>
<script setup lang="ts">
import MiddleChart from './components/MiddleChart.vue';
// import TopPanel from './components/TopPanel.vue';
</script>

<style scoped>
.row-container:not(:last-child) {
  margin-bottom: 16px;
}
</style>
