<template>
  <div>
    <t-card class="list-card-container" :bordered="false">
      <t-row justify="space-between">
        <t-col :span="2">
          <div class="left-operation-container">
            <t-button @click="openAddAppDialog"> 添加应用 </t-button>
          </div>
        </t-col>
        <t-col :span="10">
          <t-form ref="form" :data="queryData" :label-width="80" colon @submit="onSubmit">
            <t-row>
              <t-col :span="10">
                <t-row :gutter="[24, 24]" justify="end">
                  <t-col :span="4">
                    <t-form-item label="应用名称" name="name">
                      <t-input
                        v-model="queryData.name"
                        class="form-item-content"
                        type="search"
                        clearable
                        placeholder="资源名称"
                      />
                    </t-form-item>
                  </t-col>
                  <t-col :span="4">
                    <t-form-item label="状态" name="activeStatus">
                      <t-select
                        v-model="queryData.activeStatus"
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
        </t-col>
      </t-row>
      <!-- !!! 树形结构 EnhancedTable 才支持，普通 Table 不支持 !!! -->
      <!-- 第一列展开树结点，缩进为 24px，子节点字段 childrenKey 默认为 children -->
      <!-- v-model:displayColumns="displayColumns" used to control displayed columns -->
      <!-- v-model:expandedTreeNodes is not required. you can control expanded tree node by expandedTreeNodes -->
      <t-enhanced-table
        ref="tableRef"
        v-model:expandedTreeNodes="expandedTreeNodes"
        row-key="id"
        drag-sort="row-handler"
        :data="data"
        :columns="columns"
        :tree="treeConfig"
        :pagination="pagination"
        :before-drag-sort="beforeDragSort"
        :loading="dataLoading"
        @page-change="onPageChange"
        @abnormal-drag-sort="onAbnormalDragSort"
        @drag-sort="onDragSort"
        @expanded-tree-nodes-change="onExpandedTreeNodesChange"
      >
        <template #activeStatus="{ row }">
          <t-switch
            v-model="row.activeStatus"
            width="120px"
            :custom-value="[ACTIVE_STATUS.ACTIVE, ACTIVE_STATUS.INACTIVE]"
            :label="[ACTIVE_STATUS_LABEL.ACTIVE, ACTIVE_STATUS_LABEL.INACTIVE]"
            size="large"
            @click="handleUpdateStatus(row)"
          >
          </t-switch>
        </template>
      </t-enhanced-table>
      <!-- @tree-expand-change="onTreeExpandChange" -->

      <!-- 第二列展开树结点，缩进为 12px，示例代码有效，勿删 -->
      <!-- indent 定义缩进距离 -->
      <!-- 如果子结点字段不是 'children'，可以使用 childrenKey 定义字段别名，如 `:tree="{ childrenKey: 'list' }"` -->
      <!-- <t-enhanced-table
      ref="tableRef"
      rowKey="key"
      :pagination="defaultPagination"
      :data="data"
      :columns="columns"
      :tree="{ indent: 12, childrenKey: 'list', defaultExpandAll: true }"
      @page-change="onPageChange"
    ></t-enhanced-table> -->
    </t-card>
    <dialog-from-app
      v-if="formDialogVisible"
      v-model:visible="formDialogVisible"
      :dialog-app="dialogApp"
      :dialog-is-add="dialogIsAdd"
      :dialog-is-main="dialogIsMain"
      @close-add-app-dialog="closeAddAppDialog"
    />
    <drawer-app-config
      v-if="drawerAppConfigVisible"
      v-model:visible="drawerAppConfigVisible"
      @close-drawer-app-config="closeDrawerAppConfig"
    />
  </div>
</template>
<script setup lang="jsx">
import { EnhancedTable as TEnhancedTable, MessagePlugin } from 'tdesign-vue-next';
import { onMounted, reactive, ref } from 'vue';

import { getAppPage, updateAppActiveStatus } from '@/api/system/app';
import { ACTIVE_STATUS, ACTIVE_STATUS_LABEL, ACTIVE_STATUS_OPTIONS } from '@/constants';

import DialogFromApp from './components/DialogFromApp.vue';
import DrawerAppConfig from './components/DrawerAppConfig.vue';

// 分页参数
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
});

const dataLoading = ref(false);
const fetchData = async () => {
  dataLoading.value = true;
  try {
    const { records, size, total, current } = await getAppPage({
      current: pagination.current,
      size: pagination.pageSize,
      name: queryData.value.name,
      activeStatus: queryData.value.activeStatus,
    });
    data.value = records;
    pagination.current = current;
    pagination.pageSize = size;
    pagination.total = total;
  } catch (e) {
    console.log(e);
  } finally {
    dataLoading.value = false;
  }
};

function getData() {
  fetchData();
}

// 搜索
const onSubmit = () => {
  fetchData();
};
onMounted(() => {
  getData();
});
const tableRef = ref(null);
const data = ref();
const lazyLoadingData = ref(null);
// 查询参数
const searchForm = {
  name: '',
  activeStatus: '',
};
const queryData = ref({ ...searchForm });

// 非必须，如果不传，表格有内置树形节点展开逻辑
const expandedTreeNodes = ref([]);

const treeConfig = reactive({ treeNodeColumnIndex: 1, indent: 25 });

// const onDeleteConfirm = (row) => {
//   // 移除当前节点及其所有子节点
//   tableRef.value.remove(row.key);

//   // 仅移除所有子节点
//   // tableRef.value.removeChildren(row.key);
//   MessagePlugin.success('删除成功');
// };

const onLookUp = (row) => {
  const allRowData = tableRef.value.getData(row.key);
  const message = '当前行全部数据，包含节点路径、父节点、子节点、是否展开、是否禁用等';
  MessagePlugin.success(`打开控制台查看${message}`);
  console.log(`${message}：`, allRowData);
};

function appendMultipleDataTo(row) {
  const randomKey1 = Math.round(Math.random() * Math.random() * 1000) + 10000;
  const randomKey2 = Math.round(Math.random() * Math.random() * 1000) + 10000;
  // const randomKey3 = Math.round(Math.random() * Math.random() * 1000) + 10000;
  // const appendList = [
  //   {
  //     id: randomKey1,
  //     key: `申请人 ${randomKey1} 号`,
  //     platform: '电子签署',
  //     type: 'Number',
  //   },
  //   {
  //     id: randomKey2,
  //     key: `申请人 ${randomKey2} 号`,
  //     platform: '纸质签署',
  //     type: 'Number',
  //   },
  //   {
  //     id: randomKey3,
  //     key: `申请人 ${randomKey3} 号`,
  //     platform: '纸质签署',
  //     type: 'Number',
  //     list: true,
  //   },
  // ];
  // MessagePlugin.success(`已插入子节点申请人 ${randomKey1} 和 ${randomKey2} 号，请展开查看`);
}

const columns = [
  {
    colKey: 'id',
    title: 'ID',
    width: 100,
  },
  {
    colKey: 'label',
    title: '应用名',
    ellipsis: true,
  },
  {
    colKey: 'describe',
    title: '描述',
    ellipsis: true,
  },
  {
    colKey: 'activeStatus',
    title: '状态',
    width: 100,
  },
  {
    colKey: 'ctime',
    title: '创建时间',
    width: 170,
  },
  {
    colKey: 'operate',
    width: 280,
    title: '操作',
    // 增、删、改、查 等操作
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    cell: (h, { row }) => (
      <div class="tdesign-table-demo__table-operations">
        <t-space>
          <t-link
            style={{
              display:
                row.parentApp === undefined ||
                row.parentApp === null ||
                row.parentApp.id === null ||
                row.parentApp.id === '0'
                  ? 'inline'
                  : 'none',
            }}
            variant="text"
            theme="primary"
            onClick={() => openAddAppVersionDialog(row)}
          >
            新增版本
          </t-link>
          <t-link variant="text" theme="primary" hover="color" onClick={() => onEditClick(row)}>
            更新
          </t-link>
          <t-link variant="text" theme="primary" hover="color" onClick={() => onLookUp(row)}>
            详情
          </t-link>
          <t-link variant="text" theme="primary" hover="color" onClick={() => displayDrawerAppConfig(row)}>
            资源配置
          </t-link>
          {/* <t-popconfirm content="确认删除吗" onConfirm={() => onDeleteConfirm(row)}>
            <t-link variant="text" hover="color" theme="danger">
              删除
            </t-link>
          </t-popconfirm> */}
        </t-space>
      </div>
    ),
  },
];

// const expandAll = ref(false);

const onPageChange = (pageInfo) => {
  pagination.current = pageInfo.current;
  pagination.pageSize = pageInfo.pageSize;
  data.value = getData();
};

// const treeExpandAndFoldIconRender = (h, { type, row }) => {
//   if (lazyLoadingData.value && lazyLoadingData.value.key === row?.key) {
//     return <Loading size="14px" />;
//   }
//   return type === 'expand' ? <ChevronRightIcon /> : <ChevronDownIcon />;
// };

// 懒加载图标渲染
// const lazyLoadingTreeIconRender = (h, params) => {
//   const { type, row } = params;
//   if (lazyLoadingData.value && lazyLoadingData.value.key === row?.key) {
//     return <Loading size="14px" />;
//   }
//   return type === 'expand' ? <AddRectangleIcon /> : <MinusRectangleIcon />;
// };

// 默认展开全部。示例代码有效，勿删
// onMounted(() => {
//   tableRef.value.expandAll();
// });

const onAbnormalDragSort = (params) => {
  console.log(params);
  // MessagePlugin.warning(params.reason);
  if (params.code === 1001) {
    MessagePlugin.warning('不同层级的元素，不允许调整顺序');
  }
};

const onExpandedTreeNodesChange = (expandedTreeNodes, context) => {
  console.log(expandedTreeNodes, context);
  // 全选不需要处理；仅处理懒加载
  if (!context.rowState) return;
  onTreeExpandChange(context);
};

const onTreeExpandChange = (context) => {
  console.log(context.rowState.expanded ? '展开' : '收起', context);
  /**
   * 如果是懒加载，请确认自己完成了以下几个步骤
   * 1. 提前设置 children 值为 true；
   * 2. 在 onTreeExpandChange 事件中处理异步数据；
   * 3. 自定义展开图标渲染 lazyLoadingTreeIconRender
   */
  if (context.row.list === true) {
    lazyLoadingData.value = context.row;
    const timer = setTimeout(() => {
      appendMultipleDataTo(context.row);
      lazyLoadingData.value = null;
      clearTimeout(timer);
    }, 200);
  }
};

const onDragSort = (params) => {
  console.log('onDragSort:', params);
};

// 应用于需要阻止拖拽排序的场景。如：当子节点存在时，则不允许调整顺序。
// 返回值为 true，允许拖拽排序；返回值 为 false，则阻止拖拽排序
const beforeDragSort = (params) => {
  console.log('beforeDragSort:', params);
  return true;
};

const handleUpdateStatus = async (row) => {
  await updateAppActiveStatus(row.id);
  fetchData();
};

// 控制应用弹框
const dialogIsAdd = ref(true);
const dialogIsMain = ref(true);
const formDialogVisible = ref(false);
const openAddAppDialog = () => {
  dialogIsMain.value = true;
  dialogIsAdd.value = true;
  formDialogVisible.value = true;
};
const closeAddAppDialog = () => {
  formDialogVisible.value = false;
  dialogIsMain.value = true;
  dialogIsAdd.value = true;
  fetchData();
};

// 控制应用版本弹框
const openAddAppVersionDialog = (row) => {
  dialogIsMain.value = false;
  dialogIsAdd.value = true;
  dialogApp.value = {
    parentApp: { id: row.id },
  };
  formDialogVisible.value = true;
};

// 编辑
const dialogApp = ref();
const onEditClick = (row) => {
  dialogApp.value = {
    id: row.id,
    name: row.name,
    parentApp: row.parentApp,
    describe: row.describe,
    activeStatus: row.activeStatus,
  };
  if (row.parentApp != null && row.parentApp.id != null && row.parentApp.id !== '0') {
    // 编辑应用版本
    dialogIsMain.value = false;
  } else {
    dialogIsMain.value = true;
  }
  dialogIsAdd.value = false;
  // 打开弹框
  formDialogVisible.value = true;
};

// app配置
const drawerAppConfigVisible = ref(false);

const displayDrawerAppConfig = () => {
  drawerAppConfigVisible.value = true;
};
const closeDrawerAppConfig = () => {
  drawerAppConfigVisible.value = false;
  console.log('收到关闭抽屉事件');
  fetchData();
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
