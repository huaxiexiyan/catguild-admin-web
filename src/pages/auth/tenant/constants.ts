import { PrimaryTableCol, TableRowData } from 'tdesign-vue-next';

export const COLUMNS: PrimaryTableCol<TableRowData>[] = [
  { colKey: 'row-select', type: 'multiple', width: 64, fixed: 'left' },
  {
    title: '租户名称',
    align: 'left',
    width: 240,
    colKey: 'name',
    fixed: 'left',
  },
  {
    title: 'UID',
    width: 120,
    colKey: 'uid',
  },
  {
    title: '注册邮箱',
    width: 180,
    ellipsis: true,
    colKey: 'email',
  },
  {
    title: '备注',
    ellipsis: true,
    colKey: 'remarks',
  },
  { title: '状态', colKey: 'activeStatus', width: 120 },
  {
    title: '注册时间',
    width: 180,
    ellipsis: true,
    colKey: 'ctime',
  },
  {
    align: 'left',
    fixed: 'right',
    width: 160,
    colKey: 'op',
    title: '操作',
  },
];
