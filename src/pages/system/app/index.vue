<template>
  <div>
    <div>
      <t-button @click="appendToRoot">添加根节点</t-button>
    </div>
    <br />
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
      @page-change="onPageChange"
      @abnormal-drag-sort="onAbnormalDragSort"
      @drag-sort="onDragSort"
      @expanded-tree-nodes-change="onExpandedTreeNodesChange"
    ></t-enhanced-table>
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
  </div>
</template>
<script setup lang="jsx">
// import {
//   AddRectangleIcon,
//   ChevronDownIcon,
//   ChevronRightIcon,
//   MinusRectangleIcon,
//   MoveIcon,
// } from 'tdesign-icons-vue-next';
// import { EnhancedTable as TEnhancedTable, Loading, MessagePlugin } from 'tdesign-vue-next';
// import { computed, /** , onMounted */ reactive, ref } from 'vue';
// import { getAppPage, getAppVersion } from '@/api/system/app';
import { EnhancedTable as TEnhancedTable, MessagePlugin } from 'tdesign-vue-next';
import { reactive, ref } from 'vue';

import { getAppPage } from '@/api/system/app';

const TOTAL = 5;
// 分页参数
const pagination = reactive({
  current: 1,
  pageSize: TOTAL,
  total: TOTAL,
});

// function getObject(i, currentPage) {
//   return {
//     id: i,
//     key: `申请人 ${i}_${currentPage} 号`,
//     platform: ['电子签署', '纸质签署', '纸质签署'][i % 3],
//     type: ['String', 'Number', 'Array', 'Object'][i % 4],
//     default: ['-', '0', '[]', '{}'][i % 4],
//     detail: {
//       position: `读取 ${i} 个数据的嵌套信息值`,
//     },
//     needed: i % 4 === 0 ? '是' : '否',
//     description: '数据源',
//   };
// }

const fetchData = async () => {
  try {
    const { records, size, total, current } = await getAppPage({
      current: pagination.current,
      size: pagination.pageSize,
      name: '',
    });
    data.value = records;
    pagination.current = current;
    pagination.current = size;
    pagination.current = total;
  } catch (e) {
    console.log(e);
  }
};

function getData() {
  fetchData();
}

const tableRef = ref(null);
const data = ref(getData());
const lazyLoadingData = ref(null);

// 非必须，如果不传，表格有内置树形节点展开逻辑
const expandedTreeNodes = ref([]);

const treeConfig = reactive({ childrenKey: 'versions', treeNodeColumnIndex: 1, indent: 25 });

const onEditClick = (row) => {
  const newData = {
    ...row,
    platform: 'New',
    type: 'Symbol',
    default: 'undefined',
  };
  tableRef.value.setData(row.key, newData);
  MessagePlugin.success('数据已更新');
};

const onDeleteConfirm = (row) => {
  // 移除当前节点及其所有子节点
  tableRef.value.remove(row.key);

  // 仅移除所有子节点
  // tableRef.value.removeChildren(row.key);
  MessagePlugin.success('删除成功');
};

const onLookUp = (row) => {
  const allRowData = tableRef.value.getData(row.key);
  const message = '当前行全部数据，包含节点路径、父节点、子节点、是否展开、是否禁用等';
  MessagePlugin.success(`打开控制台查看${message}`);
  console.log(`${message}：`, allRowData);
};

const appendTo = (row) => {
  const randomKey1 = Math.round(Math.random() * Math.random() * 1000) + 10000;
  tableRef.value.appendTo(row.key, {
    id: randomKey1,
    key: `申请人 ${randomKey1} 号`,
    platform: '电子签署',
    type: 'Number',
  });
  MessagePlugin.success(`已插入子节点申请人 ${randomKey1} 号，请展开查看`);

  // 一次性添加多个子节点。示例代码有效，勿删！!!
  // appendMultipleDataTo(row);
};

function appendMultipleDataTo(row) {
  const randomKey1 = Math.round(Math.random() * Math.random() * 1000) + 10000;
  const randomKey2 = Math.round(Math.random() * Math.random() * 1000) + 10000;
  const randomKey3 = Math.round(Math.random() * Math.random() * 1000) + 10000;
  const appendList = [
    {
      id: randomKey1,
      key: `申请人 ${randomKey1} 号`,
      platform: '电子签署',
      type: 'Number',
    },
    {
      id: randomKey2,
      key: `申请人 ${randomKey2} 号`,
      platform: '纸质签署',
      type: 'Number',
    },
    {
      id: randomKey3,
      key: `申请人 ${randomKey3} 号`,
      platform: '纸质签署',
      type: 'Number',
      list: true,
    },
  ];
  tableRef.value.appendTo(row?.key, appendList);
  MessagePlugin.success(`已插入子节点申请人 ${randomKey1} 和 ${randomKey2} 号，请展开查看`);
}

const columns = [
  {
    colKey: 'id',
    title: '编号',
    ellipsis: true,
    width: 180,
  },
  {
    width: 180,
    colKey: 'name',
    title: '应用名',
    ellipsis: true,
  },
  {
    colKey: 'uid',
    title: 'UID',
    width: 100,
  },
  {
    colKey: 'status',
    title: '状态',
    width: 60,
  },
  {
    colKey: 'cTime',
    title: '创建时间',
    width: 140,
  },
  {
    colKey: 'operate',
    width: 200,
    title: '操作',
    // 增、删、改、查 等操作
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    cell: (h, { row }) => (
      <div class="tdesign-table-demo__table-operations">
        <t-link variant="text" hover="color" onClick={() => appendTo(row)}>
          新增版本
        </t-link>
        <t-link variant="text" hover="color" onClick={() => onEditClick(row)}>
          更新
        </t-link>
        <t-link variant="text" hover="color" onClick={() => onLookUp(row)}>
          查看
        </t-link>
        <t-popconfirm content="确认删除吗" onConfirm={() => onDeleteConfirm(row)}>
          <t-link variant="text" hover="color" theme="danger">
            删除
          </t-link>
        </t-popconfirm>
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

const appendToRoot = () => {
  const key = Math.round(Math.random() * 10010);
  const newData = {
    id: key,
    key: `申请人 ${key}_${1} 号`,
    platform: key % 2 === 0 ? '共有' : '私有',
    type: ['String', 'Number', 'Array', 'Object'][key % 4],
    default: ['-', '0', '[]', '{}'][key % 4],
    detail: {
      position: `读取 ${key} 个数据的嵌套信息值`,
    },
    needed: key % 4 === 0 ? '是' : '否',
    description: '数据源',
  };
  // data.value.push(newData);
  tableRef.value.appendTo('', newData);

  // 同时添加多个元素，示例代码有效勿删
  // appendMultipleDataTo();
};

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
</script>

<style scoped>
.tdesign-table-demo__table-operations .t-link {
  padding: 0 8px;
}
</style>
