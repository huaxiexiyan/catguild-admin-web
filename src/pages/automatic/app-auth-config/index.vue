<template>
  <div>
    <t-card class="list-card-container" :bordered="false">
      <t-row justify="space-between">
        <t-col :span="2">
          <div class="left-operation-container">
            <t-button
              variant="base"
              theme="default"
              :disabled="!selectedRowKeys.length"
              @click="handleClearAppAuthConfigToken"
            >
              清空授权
            </t-button>
            <p v-if="!!selectedRowKeys.length" class="selected-count">已选{{ selectedRowKeys.length }}项</p>
          </div>
        </t-col>
        <t-col :span="10">
          <t-form ref="form" :data="queryData" :label-width="80" colon @submit="searchPage">
            <t-row>
              <t-col :span="10">
                <t-row :gutter="[24, 24]">
                  <t-col :span="4">
                    <t-form-item label="授权类型" name="name">
                      <t-input
                        v-model="queryData.name"
                        class="form-item-content"
                        type="search"
                        placeholder="授权类型"
                      />
                    </t-form-item>
                  </t-col>
                  <t-col :span="4">
                    <t-form-item label="授权状态" name="status">
                      <t-select
                        v-model="queryData.status"
                        class="form-item-content"
                        :options="APP_AUTH_CONFIG_STATUS_OPTIONS"
                        placeholder="授权类型"
                        clearable
                      />
                    </t-form-item>
                  </t-col>
                  <t-col :span="4">
                    <t-form-item label="活跃状态" name="activeStatus">
                      <t-select
                        v-model="queryData.activeStatus"
                        class="form-item-content"
                        :options="ACTIVE_STATUS_OPTIONS"
                        placeholder="活跃状态"
                        clearable
                      />
                    </t-form-item>
                  </t-col>
                </t-row>
              </t-col>
              <t-col :span="2" class="operation-container">
                <t-button theme="primary" type="submit" :style="{ marginLeft: 'var(--td-comp-margin-s)' }"
                  >查询</t-button
                >
                <t-button type="reset" variant="base" theme="default"> 重置</t-button>
              </t-col>
            </t-row>
          </t-form>
        </t-col>
      </t-row>
      <t-table
        :data="pageTableData"
        :columns="pageTableColums"
        :row-key="pageTableRowKey"
        vertical-align="top"
        :hover="true"
        :pagination="pagination"
        :loading="dataLoading"
        :editable-cell-state="editableCellState"
        bordered
        lazy-load
        @page-change="rehandlePageChange"
        @select-change="rehandleSelectChange"
      >
        <template #status="{ row }">
          <t-tag v-if="row.status === APP_AUTH_CONFIG_STATUS.NORMAL" theme="success">{{
            APP_AUTH_CONFIG_STATUS_LABEL.NORMAL
          }}</t-tag>
          <t-tag v-if="row.status === APP_AUTH_CONFIG_STATUS.OVERDUE" theme="danger">{{
            APP_AUTH_CONFIG_STATUS_LABEL.OVERDUE
          }}</t-tag>
        </template>
        <template #activeStatus="{ row }">
          <t-switch
            v-if="row.activeStatus != null"
            v-model="row.activeStatus"
            :custom-value="['ACTIVE', 'INACTIVE']"
            :label="[ACTIVE_STATUS_LABEL.ACTIVE, ACTIVE_STATUS_LABEL.INACTIVE]"
            size="large"
            @change="(newActiveStatus) => handleUpdateActiveStatus(newActiveStatus, row)"
          >
          </t-switch>
        </template>
      </t-table>
    </t-card>
  </div>
</template>
<script lang="ts">
export default {
  name: 'AutomaticAppAuthConfigList',
};
</script>
<script setup lang="ts">
import { Input, PageInfo, PrimaryTableCol, TableRowData } from 'tdesign-vue-next';
import { onMounted, ref } from 'vue';

import {
  addAppAuthConfig,
  clearAppAuthConfigToken,
  getAppAuthConfigPage,
  updateAppAuthConfig,
  updateAppAuthConfigActiveStatus,
} from '@/api/business/automatic/appAuthConfig';
import {
  APP_AUTH_CONFIG_STATUS,
  APP_AUTH_CONFIG_STATUS_LABEL,
  APP_AUTH_CONFIG_STATUS_OPTIONS,
} from '@/api/business/automatic/model/appAuthConfigModel';
import { ACTIVE_STATUS, ACTIVE_STATUS_LABEL, ACTIVE_STATUS_OPTIONS } from '@/constants';

// 表格显示
const pageTableRowKey = 'id';
const pageTableColums: PrimaryTableCol<TableRowData>[] = [
  { colKey: 'row-select', type: 'multiple', width: 64, fixed: 'left' },
  {
    title: '授权类型',
    width: 220,
    colKey: 'appAuthType.name',
  },
  {
    title: 'accessToken',
    colKey: 'accessToken',
    edit: {
      // 1. 支持任意组件。需保证组件包含 `value` 和 `onChange` 两个属性，且 onChange 的第一个参数值为 new value。
      // 2. 如果希望支持校验，组件还需包含 `status` 和 `tips` 属性。具体 API 含义参考 Input 组件
      component: Input,
      // props, 透传全部属性到 Input 组件。可以是一个函数，不同行有不同的 props 属性 时，使用 Function）
      props: {
        clearable: true,
        autofocus: true,
      },
      // 触发校验的时机（when to validate)
      validateTrigger: 'change',
      // 透传给 component: Input 的事件（也可以在 edit.props 中添加）
      // on: (editContext) => ({
      //   onBlur: () => {
      //     console.log('失去焦点', editContext);
      //   },
      //   onEnter: (ctx) => {
      //     ctx?.e?.preventDefault();
      //     console.log('onEnter', ctx);
      //   },
      // }),
      // 除了点击非自身元素退出编辑态之外，还有哪些事件退出编辑态
      abortEditOnEvent: ['onEnter'],
      // 编辑完成，退出编辑态后触发
      onEdited: (context) => {
        // console.log(context);
        // data.value.splice(context.rowIndex, 1, context.newRowData);
        // console.log('Edit firstName:', context);
        // MessagePlugin.success('Success');
        saveAppAuthConfig(context.newRowData);
      },
      // 校验规则，此处同 Form 表单。https://tdesign.tencent.com/vue-next/components/form
      // rules: [{ required: true, message: '不能为空' }],
      // 默认是否为编辑状态
      defaultEditable: false,
    },
  },
  {
    title: 'refreshToken',
    colKey: 'refreshToken',
    edit: {
      // 1. 支持任意组件。需保证组件包含 `value` 和 `onChange` 两个属性，且 onChange 的第一个参数值为 new value。
      // 2. 如果希望支持校验，组件还需包含 `status` 和 `tips` 属性。具体 API 含义参考 Input 组件
      component: Input,
      // props, 透传全部属性到 Input 组件。可以是一个函数，不同行有不同的 props 属性 时，使用 Function）
      props: {
        clearable: true,
        autofocus: true,
      },
      // 触发校验的时机（when to validate)
      validateTrigger: 'change',
      // 透传给 component: Input 的事件（也可以在 edit.props 中添加）
      // on: (editContext) => ({
      //   onBlur: () => {
      //     console.log('失去焦点', editContext);
      //   },
      //   onEnter: (ctx) => {
      //     ctx?.e?.preventDefault();
      //     console.log('onEnter', ctx);
      //   },
      // }),
      // 除了点击非自身元素退出编辑态之外，还有哪些事件退出编辑态
      abortEditOnEvent: ['onEnter'],
      // 编辑完成，退出编辑态后触发
      onEdited: (context) => {
        // console.log(context);
        // data.value.splice(context.rowIndex, 1, context.newRowData);
        // console.log('Edit firstName:', context);
        // MessagePlugin.success('Success');
        saveAppAuthConfig(context.newRowData);
      },
      // 校验规则，此处同 Form 表单。https://tdesign.tencent.com/vue-next/components/form
      // rules: [{ required: true, message: '不能为空' }],
      // 默认是否为编辑状态
      defaultEditable: false,
    },
  },
  {
    title: '过期时间',
    width: 100,
    colKey: 'expiresIn',
  },
  {
    title: '授权状态',
    width: 100,
    colKey: 'status',
  },
  {
    title: '活跃状态',
    width: 100,
    colKey: 'activeStatus',
  },
  {
    title: 'accessToken更新时间',
    colKey: 'lastUpdateAccessTokenTime',
  },
  {
    title: 'refreshToken更新时间',
    colKey: 'lastUpdateRefreshTokenTime',
  },
];
// 控制可编辑的列
const editableCellState = (cellParams) => {
  // 第一行不允许编辑
  const { row } = cellParams;
  return true;
};
interface QueryData {
  name: string;
  activeStatus?: APP_AUTH_CONFIG_STATUS;
  status?: ACTIVE_STATUS;
}
const searchForm = {
  name: '',
};
const queryData = ref<QueryData>({ ...searchForm });
const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
});
const dataLoading = ref(false);
const pageTableData = ref([]);
const fetchData = async () => {
  dataLoading.value = true;
  try {
    const { records, total, current, size } = await getAppAuthConfigPage({
      current: pagination.value.current,
      size: pagination.value.pageSize,
      name: queryData.value.name,
      activeStatus: queryData.value.activeStatus,
      status: queryData.value.status,
    });
    pageTableData.value = records;
    pagination.value.total = total;
    pagination.value.pageSize = size;
    pagination.value.current = current;
  } catch (e) {
    console.log(e);
  } finally {
    dataLoading.value = false;
  }
};
onMounted(() => {
  fetchData();
});
// 分页
const rehandlePageChange = (pageInfo: PageInfo, newDataSource: TableRowData[]) => {
  pagination.value = {
    ...pagination.value,
    pageSize: pageInfo.pageSize,
    current: pageInfo.current,
  };
  fetchData();
};
// 批量选择
const selectedRowKeys = ref([]);
const rehandleSelectChange = (val: string[]) => {
  selectedRowKeys.value = val;
};
// 条件查询
const searchPage = () => {
  fetchData();
};
// 编辑列表
const saveAppAuthConfig = async (row) => {
  if (row.id === null) {
    await addAppAuthConfig({
      appAuthType: { id: row.appAuthType.id },
      accessToken: row.accessToken,
      refreshToken: row.refreshToken,
    });
  } else {
    await updateAppAuthConfig({ id: row.id, accessToken: row.accessToken, refreshToken: row.refreshToken });
  }
  fetchData();
};
// 改变状态
const handleUpdateActiveStatus = async (newActiveStatus, row) => {
  await updateAppAuthConfigActiveStatus({ id: row.id, activeStatus: newActiveStatus }).then(() => {
    fetchData();
  });
};
//
const handleClearAppAuthConfigToken = async () => {
  await clearAppAuthConfigToken({ ids: selectedRowKeys.value }).then(() => {
    fetchData();
  });
};
</script>

<style lang="less" scoped>
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
  width: 460px;
}
.operation-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;

  .expand {
    .t-button__text {
      display: flex;
      align-items: center;
    }
  }
}
</style>
