<template>
  <div>
    <t-card class="list-card-container" :bordered="false">
      <t-row justify="space-between">
        <t-col :span="1">
          <div class="left-operation-container">
            <t-button @click="openAddResourceDialog"> 新增资源 </t-button>
          </div>
        </t-col>
        <t-col :span="11">
          <div class="search-input">
            <t-form ref="form" :data="queryData" :label-width="80" colon @reset="onReset" @submit="onSubmit">
              <t-row>
                <t-col :span="10" class="input-container">
                  <t-row :gutter="[0, 0]" justify="end">
                    <t-col :span="3">
                      <t-form-item label="资源名称" name="name">
                        <t-input
                          v-model="queryData.name"
                          class="form-item-content"
                          type="search"
                          placeholder="资源名称"
                        />
                      </t-form-item>
                    </t-col>
                    <t-col :span="3">
                      <t-form-item label="资源id" name="id">
                        <t-input-number
                          v-model="queryData.id"
                          theme="normal"
                          class="form-item-content"
                          placeholder="请输入资源id"
                          :style="{ minWidth: '180px' }"
                        />
                      </t-form-item>
                    </t-col>
                    <t-col :span="2">
                      <t-form-item label="类型" name="type">
                        <t-select
                          v-model="queryData.type"
                          class="form-item-content"
                          :options="ACTIVE_STATUS_OPTIONS"
                          placeholder="类型"
                          clearable
                        />
                      </t-form-item>
                    </t-col>
                    <t-col :span="2">
                      <t-form-item label="状态" name="status">
                        <t-select
                          v-model="queryData.status"
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
        </t-col>
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
        <template #type="{ row }">
          <p v-if="row.type === RESOURCE_TYPE.MENU">{{ RESOURCE_TYPE_LABEL.MENU }}</p>
          <p v-if="row.type === RESOURCE_TYPE.BUTTON">{{ RESOURCE_TYPE_LABEL.BUTTON }}</p>
        </template>
        <template #status="{ row }">
          <t-switch
            v-model="row.status"
            width="120px"
            :custom-value="[ACTIVE_STATUS.ACTIVE, ACTIVE_STATUS.INACTIVE]"
            :label="[ACTIVE_STATUS_LABEL.ACTIVE, ACTIVE_STATUS_LABEL.INACTIVE]"
            size="large"
            @click="handleUpdateStatus(row)"
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

    <dialog-from-tenant
      v-model:visible="formDialogVisible"
      :active-form-father="0"
      @close-add-resource-dialog="closeAddResourceDialog"
    />
  </div>
</template>

<script lang="ts">
export default {
  name: 'SystemMenuList',
};
</script>

<script setup lang="ts">
import { PageInfo, TableRowData } from 'tdesign-vue-next';
import { computed, onMounted, ref } from 'vue';

import { RESOURCE_TYPE, RESOURCE_TYPE_LABEL } from '@/api/system/model/resourceModel';
import { getResourcePage, updateResourceStatus } from '@/api/system/resource';
import { prefix } from '@/config/global';
import { ACTIVE_STATUS, ACTIVE_STATUS_LABEL, ACTIVE_STATUS_OPTIONS } from '@/constants';
import { useSettingStore } from '@/store';

import DialogFromTenant from './components/DialogFromTenant.vue';
import { COLUMNS } from './constants';

interface QueryData {
  id?: string;
  name: string;
  type?: RESOURCE_TYPE;
  status?: ACTIVE_STATUS;
}
const searchForm = {
  name: '',
};
const queryData = ref<QueryData>({ ...searchForm });
const store = useSettingStore();

const data = ref([]);
const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 10,
});

const dataLoading = ref(false);
const fetchData = async () => {
  dataLoading.value = true;
  try {
    const { records, total } = await getResourcePage({
      current: pagination.value.current,
      size: pagination.value.pageSize,
      name: queryData.value.name,
      type: queryData.value.type,
      status: queryData.value.status,
      id: queryData.value.id,
    });
    data.value = records;
    pagination.value.total = total;
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
    pageSize: pageInfo.pageSize,
    current: pageInfo.current,
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

// 详情
const handleClickDetail = (row: { rowIndex: any }) => {
  console.log('详情');
};

const onReset = (val: unknown) => {
  console.log(val);
};
const onSubmit = (val: unknown) => {
  fetchData();
};

const handleUpdateStatus = async (row: { id: string; status: ACTIVE_STATUS }) => {
  await updateResourceStatus(row.id, row.status);
  fetchData();
};

// 控制新增资源弹框
const formDialogVisible = ref(false);
const openAddResourceDialog = () => {
  formDialogVisible.value = true;
};
const closeAddResourceDialog = () => {
  formDialogVisible.value = false;
  fetchData();
};
</script>

<style lang="less" scoped>
.input-container {
  text-align: right;
}
</style>
