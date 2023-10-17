<template>
  <div>
    <t-card class="list-card-container" :bordered="false">
      <t-row justify="space-between">
        <t-col :span="2">
          <div class="left-operation-container">
            <t-upload
              ref="uploadRef1"
              action="http://127.0.0.1:20000/api/business/erp/online/orders/import"
              theme="file"
              placeholder="相同订单号会被覆盖更新"
              accept="csv"
              :headers="{ Authorization: `Bearer ${token}` }"
              :size-limit="{ size: 10, unit: 'MB' }"
              ><t-button variant="outline">
                <template #icon><cloud-upload-icon /></template>
                导入在线订单
              </t-button>
            </t-upload>
          </div>
        </t-col>
        <t-col :span="10">
          <div class="search-input">
            <t-form ref="form" :data="queryData" :label-width="80" colon @submit="searchOnlineOrder">
              <t-row justify="space-between">
                <t-col :span="8">
                  <t-row :gutter="[0, 0]" justify="end">
                    <t-col :span="8">
                      <t-form-item label="订单号" name="likeOrderNum">
                        <t-input
                          v-model="queryData.likeOrderNum"
                          class="form-item-content"
                          type="search"
                          placeholder="订单号"
                        />
                      </t-form-item>
                    </t-col>
                  </t-row>
                </t-col>
                <t-col :span="2">
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
        :data="onlineOrderTableData"
        :columns="onlineOrderTableColums"
        :row-key="onlineOrderTableRowKey"
        vertical-align="top"
        :hover="true"
        :pagination="pagination"
        :loading="dataLoading"
        @page-change="rehandlePageChange"
        @select-change="rehandleSelectChange"
      >
        <template #orderStatus="{ row }">
          <p v-if="row.orderStatus === ORDER_STATUS.PENDING_SHIPMENT">{{ ORDER_STATUS_LABEL.PENDING_SHIPMENT }}</p>
          <p v-if="row.orderStatus === ORDER_STATUS.PENDING_PAYMENT">{{ ORDER_STATUS_LABEL.PENDING_PAYMENT }}</p>
          <p v-if="row.orderStatus === ORDER_STATUS.NOT_SHIPPED_REFUND_SUCCESS">
            {{ ORDER_STATUS_LABEL.NOT_SHIPPED_REFUND_SUCCESS }}
          </p>
          <p v-if="row.orderStatus === ORDER_STATUS.SHIPPED_PENDING_RECEIPT">
            {{ ORDER_STATUS_LABEL.SHIPPED_PENDING_RECEIPT }}
          </p>
          <p v-if="row.orderStatus === ORDER_STATUS.SHIPPED_REFUND_SUCCESS">
            {{ ORDER_STATUS_LABEL.SHIPPED_REFUND_SUCCESS }}
          </p>
          <p v-if="row.orderStatus === ORDER_STATUS.RECEIVED">{{ ORDER_STATUS_LABEL.RECEIVED }}</p>
          <p v-if="row.orderStatus === ORDER_STATUS.CANCELLED">{{ ORDER_STATUS_LABEL.CANCELLED }}</p>
        </template>
        <template #afterSalesStatus="{ row }">
          <p v-if="row.afterSalesStatus === AFTER_SALES_STATUS.PROCESSING">
            {{ AFTER_SALES_STATUS_LABEL.PROCESSING }}
          </p>
          <p v-if="row.afterSalesStatus === AFTER_SALES_STATUS.REFUND_SUCCESS">
            {{ AFTER_SALES_STATUS_LABEL.REFUND_SUCCESS }}
          </p>
          <p v-if="row.afterSalesStatus === AFTER_SALES_STATUS.NO_AFTER_SALES_OR_CANCELLED">
            {{ AFTER_SALES_STATUS_LABEL.NO_AFTER_SALES_OR_CANCELLED }}
          </p>
        </template>
        <!-- <template #op="slotProps">
          <t-space>
            <t-link theme="primary" @click="handleClickDetail(slotProps)">详情</t-link>
          </t-space>
        </template> -->
      </t-table>
    </t-card>
  </div>
</template>
<script lang="ts">
export default {
  name: 'ERPOnlineOrderList',
};
</script>
<script setup lang="ts">
import { CloudUploadIcon } from 'tdesign-icons-vue-next';
import { PageInfo, PrimaryTableCol, TableRowData } from 'tdesign-vue-next';
import { onMounted, ref } from 'vue';

import {
  AFTER_SALES_STATUS,
  AFTER_SALES_STATUS_LABEL,
  ORDER_STATUS,
  ORDER_STATUS_LABEL,
} from '@/api/business/erp/model/onlineOrderModel';
import { getOnlineOrderPage } from '@/api/business/erp/onlineOrder';
import { useUserStore } from '@/store';

const { token } = useUserStore();
// 表格显示
const onlineOrderTableRowKey = 'id';
const onlineOrderTableColums: PrimaryTableCol<TableRowData>[] = [
  { colKey: 'row-select', type: 'multiple', width: 64, fixed: 'left' },
  {
    title: '订单号',
    width: 220,
    colKey: 'orderNum',
  },
  {
    title: '销售额(元)',
    width: 100,
    colKey: 'actualMerchantRevenue',
  },
  {
    title: '订单状态',
    colKey: 'orderStatus',
  },
  {
    title: '售后状态',
    colKey: 'afterSalesStatus',
  },
  {
    title: '成交时间',
    colKey: 'orderCompletionTime',
  },
  {
    align: 'left',
    fixed: 'right',
    colKey: 'op',
    title: '操作',
  },
];
const searchForm = {
  likeOrderNum: '',
};
const queryData = ref({ ...searchForm });
const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
});
const dataLoading = ref(false);
const onlineOrderTableData = ref([]);
const fetchData = async () => {
  dataLoading.value = true;
  try {
    const { records, total, current, size } = await getOnlineOrderPage({
      current: pagination.value.current,
      size: pagination.value.pageSize,
      likeOrderNum: queryData.value.likeOrderNum,
    });
    onlineOrderTableData.value = records;
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
const rehandleSelectChange = (val: number[]) => {
  selectedRowKeys.value = val;
};
// 条件查询
const searchOnlineOrder = () => {
  fetchData();
};
</script>

<style scoped></style>
