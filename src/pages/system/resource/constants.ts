import { PrimaryTableCol, TableRowData } from 'tdesign-vue-next';

// 列表
export const COLUMNS: PrimaryTableCol<TableRowData>[] = [
  { colKey: 'row-select', type: 'multiple', width: 64, fixed: 'left' },
  {
    title: '资源id',
    width: 180,
    colKey: 'id',
  },
  {
    title: '资源名称',
    align: 'left',
    width: 200,
    colKey: 'name',
    fixed: 'left',
  },
  {
    title: '资源类型',
    width: 200,
    ellipsis: true,
    colKey: 'type',
  },
  {
    title: '备注',
    ellipsis: true,
    colKey: 'remarks',
  },
  { title: '状态', colKey: 'status', width: 120 },
  {
    title: '注册时间',
    width: 180,
    ellipsis: true,
    colKey: 'cTime',
  },
  {
    align: 'left',
    fixed: 'right',
    width: 160,
    colKey: 'op',
    title: '操作',
  },
];
