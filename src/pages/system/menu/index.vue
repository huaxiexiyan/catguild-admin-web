<template>
  <div>
    <t-card class="list-card-container" :bordered="false">
      <t-row justify="space-between">
        <t-col :span="2">
          <div class="left-operation-container">
            <t-button @click="openSaveMenuDialog"> 添加菜单 </t-button>
            <t-button @click="openSaveMenuDialog"> 刷新资源点 </t-button>
          </div>
        </t-col>
        <t-col :span="10">
          <div class="search-input">
            <t-form ref="form" :data="queryData" :label-width="80" colon @submit="onSubmit">
              <t-row>
                <t-col :span="10" class="input-container">
                  <t-row :gutter="[0, 0]" justify="end">
                    <t-col :span="4">
                      <t-form-item label="菜单名称" name="name">
                        <t-input v-model="queryData.name" placeholder="菜单名称" />
                      </t-form-item>
                    </t-col>
                    <t-col :span="3">
                      <t-form-item label="类型" name="type">
                        <t-select
                          v-model="queryData.type"
                          class="form-item-content"
                          :options="MENU_TYPE_OPTIONS"
                          placeholder="类型"
                          clearable
                        />
                      </t-form-item>
                    </t-col>
                    <t-col :span="3">
                      <t-form-item label="状态" name="status">
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
          </div>
        </t-col>
      </t-row>
      <!-- !!! 树形结构 EnhancedTable 才支持，普通 Table 不支持 !!! -->
      <!-- 第一列展开树结点，缩进为 24px，子节点字段 childrenKey 默认为 children -->
      <!-- v-model:displayColumns="displayColumns" used to control displayed columns -->
      <!-- v-model:expandedTreeNodes is not required. you can control expanded tree node by expandedTreeNodes -->
      <t-enhanced-table
        ref="menuTableRef"
        row-key="id"
        drag-sort="row-handler"
        :data="menuTableData"
        :columns="menuTableColumns"
        :tree="treeConfig"
      >
        <template #activeStatus="{ row }">
          <t-switch
            v-model="row.activeStatus"
            width="120px"
            :custom-value="[ACTIVE_STATUS.ACTIVE, ACTIVE_STATUS.INACTIVE]"
            :label="[ACTIVE_STATUS_LABEL.ACTIVE, ACTIVE_STATUS_LABEL.INACTIVE]"
            size="large"
            @click="handleMenuActiveStatus(row)"
          >
          </t-switch>
        </template>
      </t-enhanced-table>
    </t-card>
  </div>
  <save-menu-dialog
    v-model:visible="saveMenuDialogVisible"
    :is-add-menu="isAddMenu"
    :update-menu-id="updateMenuId"
    @close-add-menu-dialog="closeSaveMenuDialog"
  />
</template>
<script setup lang="jsx">
import { EnhancedTable as TEnhancedTable } from 'tdesign-vue-next';
import { onMounted, reactive, ref } from 'vue';

import { getMenuTree, updateMenuStatus } from '@/api/system/menu';
import { MENU_TYPE_OPTIONS } from '@/api/system/model/menuModel';
import { ACTIVE_STATUS, ACTIVE_STATUS_LABEL, ACTIVE_STATUS_OPTIONS } from '@/constants';

import SaveMenuDialog from './components/SaveMenuDialog.vue';

// 表格列配置
const treeConfig = reactive({ treeNodeColumnIndex: 1, indent: 25 });
const menuTableColumns = [
  {
    colKey: 'name',
    title: '路由名',
    width: 100,
  },
  {
    width: 180,
    colKey: 'path',
    title: '路由路径',
    ellipsis: true,
  },
  {
    colKey: 'component',
    title: '组件位置',
    ellipsis: true,
    width: 160,
  },
  {
    colKey: 'meta.title',
    title: '标题',
    width: 140,
  },
  {
    colKey: 'meta.title',
    title: '类型',
    width: 80,
  },
  {
    colKey: 'activeStatus',
    title: '活跃状态',
    width: 80,
  },
  {
    colKey: 'operate',
    width: 200,
    title: '操作',
    // 增、删、改、查 等操作
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    cell: (h, { row }) => (
      <div class="tdesign-table-demo__table-operations">
        <t-space>
          {/* <t-link
            style={{ display: row.versions !== undefined ? 'inline' : 'none' }}
            variant="text"
            theme="primary"
            onClick={() => openAddAppVersionDialog(row)}
          >
            新增版本
          </t-link> */}
          <t-link variant="text" hover="color" onClick={() => updateMenu(row)}>
            更新
          </t-link>
          {/* <t-link variant="text" hover="color" onClick={() => onLookUp(row)}>
            详情
          </t-link> */}
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

// 列表查询加载
const searchForm = {
  name: '',
  type: '',
  activeStatus: '',
};
const queryData = ref({ ...searchForm });
const fetchMenuTableData = async () => {
  try {
    const list = await getMenuTree(searchForm);
    menuTableData.value = list;
  } catch (e) {
    console.log(e);
  }
};
function getMenuTableData() {
  fetchMenuTableData();
}
const onSubmit = () => {
  fetchMenuTableData();
};

// 进入初始化
onMounted(() => {
  fetchData();
});

const menuTableRef = ref(null);
const menuTableData = ref(getMenuTableData());

const handleMenuActiveStatus = async (row) => {
  await updateMenuStatus(row.id, row.status).then(() => {
    fetchData();
  });
};

// 保存菜单弹框
const saveMenuDialogVisible = ref(false);
const isAddMenu = ref();
const openSaveMenuDialog = (isAddMenu) => {
  saveMenuDialogVisible.value = true;
  isAddMenu.value = isAddMenu;
};
const closeSaveMenuDialog = () => {
  saveMenuDialogVisible.value = false;
  fetchData();
};
// 更新菜单方法
const updateMenuId = ref();
const updateMenu = (row) => {
  // 打开弹框
  openSaveMenuDialog(false);
  // 传入菜单主键id
  updateMenuId.value = row.id;
};
</script>

<style scoped>
.tdesign-table-demo__table-operations .t-link {
  padding: 0 8px;
}
</style>
