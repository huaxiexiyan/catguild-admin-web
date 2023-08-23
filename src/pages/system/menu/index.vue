<template>
  <div>
    <t-card class="list-card-container" :bordered="false">
      <t-row justify="space-between">
        <div class="left-operation-container">
          <t-button @click="formDialogVisible = true"> 新增租户 </t-button>
          <!-- <t-button variant="base" theme="default" :disabled="!selectedRowKeys.length"> 导出合同 </t-button>
          <p v-if="!!selectedRowKeys.length" class="selected-count">已选{{ selectedRowKeys.length }}项</p> -->
        </div>
        <div class="search-input">
          <t-form ref="form" :data="formData" :label-width="80" colon @reset="onReset" @submit="onSubmit">
            <t-row>
              <t-col :span="10">
                <t-row :gutter="[24, 24]">
                  <t-col :span="4">
                    <t-form-item label="租户名称" name="name">
                      <t-input
                        v-model="formData.name"
                        class="form-item-content"
                        type="search"
                        placeholder="租户名称"
                        :style="{ minWidth: '134px' }"
                      />
                    </t-form-item>
                  </t-col>
                  <t-col :span="4">
                    <t-form-item label="UID" name="uid">
                      <t-input
                        v-model="formData.uid"
                        class="form-item-content"
                        placeholder="请输入UID"
                        :style="{ minWidth: '134px' }"
                      />
                    </t-form-item>
                  </t-col>
                  <t-col :span="4">
                    <t-form-item label="状态" name="status">
                      <t-select
                        v-model="formData.status"
                        class="form-item-content"
                        :options="ACTIVE_STATUS_OPTIONS"
                        placeholder="状态"
                        clearable
                      />
                    </t-form-item>
                  </t-col>
                </t-row>
              </t-col>

              <t-col :span="2" class="operation-container">
                <t-button theme="primary" type="submit" :style="{ marginLeft: 'var(--td-comp-margin-s)' }">
                  查询
                </t-button>
                <t-button type="reset" variant="base" theme="default"> 重置 </t-button>
              </t-col>
            </t-row>
          </t-form>
        </div>
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
        <template #status="{ row }">
          <t-switch
            v-model="row.status"
            width="120px"
            :custom-value="[ACTIVE_STATUS.ACTIVE, ACTIVE_STATUS.INACTIVE]"
            :label="[ACTIVE_STATUS_LABEL.ACTIVE, ACTIVE_STATUS_LABEL.INACTIVE]"
            size="large"
            @change="handleUpdateStatus(row)"
          >
          </t-switch>
        </template>
        <template #op="slotProps">
          <t-space>
            <t-link theme="primary" @click="handleClickDetail(slotProps)">详情</t-link>
          </t-space>
        </template>
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
import { PageInfo, TableRowData } from 'tdesign-vue-next';
import { computed, onMounted, ref } from 'vue';

import { getTenantPage } from '@/api/auth/tenant';
import { prefix } from '@/config/global';
import { ACTIVE_STATUS, ACTIVE_STATUS_LABEL, ACTIVE_STATUS_OPTIONS } from '@/constants';
import { useSettingStore } from '@/store';

import DialogFromTenant from './components/DialogFromTenant.vue';
import { COLUMNS } from './constants';

interface FormData {
  name: string;
  uid: string;
  status?: number;
}
const searchForm = {
  name: '',
  uid: '',
};
const formData = ref<FormData>({ ...searchForm });
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
const rehandlePageChange = (pageInfo: PageInfo, newDataSource: TableRowData[]) => {
  pagination.value = {
    ...pagination.value,
    defaultPageSize: pageInfo.pageSize,
    defaultCurrent: pageInfo.current,
  };
  fetchData();
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

// 详情
const handleClickDetail = (row: { rowIndex: any }) => {
  console.log('详情');
};

const onReset = (val: unknown) => {
  console.log(val);
};
const onSubmit = (val: unknown) => {
  console.log(val);
  console.log(formData.value);
};

const handleUpdateStatus = (row: { rowIndex: any }) => {
  console.log('改变状态');
  console.log(row);
};
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
