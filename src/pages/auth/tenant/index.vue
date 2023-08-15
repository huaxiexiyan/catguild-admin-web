<template>
  <div>
    <t-card class="list-card-container" :bordered="false">
      <t-row justify="space-between">
        <div class="left-operation-container">
          <t-button @click="formDialogVisible = true"> 新增租户 </t-button>
          <!-- <t-button variant="base" theme="default" :disabled="!selectedRowKeys.length"> 导出合同 </t-button>
          <p v-if="!!selectedRowKeys.length" class="selected-count">已选{{ selectedRowKeys.length }}项</p> -->
        </div>
        <!-- <div class="search-input">
          <t-input v-model="searchValue" placeholder="请输入你需要搜索的内容" clearable>
            <template #suffix-icon>
              <search-icon size="16px" />
            </template>
          </t-input>
        </div> -->
      </t-row>
      <t-table
        :data="data"
        :columns="COLUMNS"
        :row-key="rowKey"
        vertical-align="top"
        :hover="true"
        :pagination="pagination"
        :selected-row-keys="selectedRowKeys"
        :loading="dataLoading"
        :header-affixed-top="headerAffixedTop"
        @page-change="rehandlePageChange"
        @change="rehandleChange"
        @select-change="rehandleSelectChange"
      >
        <!-- <template #op="slotProps">
          <t-space>
            <t-link theme="primary" @click="handleClickDetail()">详情</t-link>
            <t-link theme="danger" @click="handleClickDelete(slotProps)">删除</t-link>
          </t-space>
        </template> -->
      </t-table>
    </t-card>

    <dialog-from-tenant v-model:visible="formDialogVisible" />

    <!-- <t-dialog
      v-model:visible="confirmVisible"
      header="确认删除当前所选合同？"
      :body="confirmBody"
      :on-cancel="onCancel"
      @confirm="onConfirmDelete"
    /> -->
  </div>
</template>

<script lang="ts">
export default {
  name: 'TenantList',
};
</script>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import { getTenantPage } from '@/api/auth/tenant';
import { prefix } from '@/config/global';
import { useSettingStore } from '@/store';

import DialogFromTenant from './components/DialogFromTenant.vue';
import { COLUMNS } from './constants';

const store = useSettingStore();

const data = ref([]);
const pagination = ref({
  defaultCurrent: 1,
  defaultPageSize: 10,
  total: 10,
});

const dataLoading = ref(false);
const fetchData = async () => {
  dataLoading.value = true;
  try {
    const { records, size, total, current } = await getTenantPage({
      current: pagination.value.defaultCurrent,
      size: pagination.value.defaultPageSize,
      name: '',
    });
    data.value = records;
    pagination.value = {
      ...pagination.value,
      defaultPageSize: size,
      defaultCurrent: current,
      total,
    };
  } catch (e) {
    console.log(e);
  } finally {
    dataLoading.value = false;
  }
};

onMounted(() => {
  fetchData();
});

const selectedRowKeys = ref([1, 2]);

const rowKey = 'index';

const rehandleSelectChange = (val: number[]) => {
  selectedRowKeys.value = val;
};
const rehandlePageChange = (curr: unknown, pageInfo: unknown) => {
  console.log('分页变化', curr, pageInfo);
};
const rehandleChange = (changeParams: unknown, triggerAndData: unknown) => {
  console.log('统一Change', changeParams, triggerAndData);
};

const headerAffixedTop = computed(
  () =>
    ({
      offsetTop: store.isUseTabsRouter ? 48 : 0,
      container: `.${prefix}-layout`,
    } as any),
);

// 新增租户
const formDialogVisible = ref(false);
</script>

<!-- <style lang="less" scoped>
.payment-col {
  display: flex;

  .trend-container {
    display: flex;
    align-items: center;
    margin-left: var(--td-comp-margin-s);
  }
}

.list-card-container {
  padding: var(--td-comp-paddingTB-xxl) var(--td-comp-paddingLR-xxl);

  :deep(.t-card__body) {
    padding: 0;
  }
}

.left-operation-container {
  display: flex;
  align-items: center;
  margin-bottom: var(--td-comp-margin-xxl);

  .selected-count {
    display: inline-block;
    margin-left: var(--td-comp-margin-l);
    color: var(--td-text-color-secondary);
  }
}

.search-input {
  width: 360px;
}
</style> -->
