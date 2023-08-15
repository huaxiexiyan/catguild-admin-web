import { PrimaryTableCol, TableRowData } from 'tdesign-vue-next';

export const COLUMNS: PrimaryTableCol<TableRowData>[] = [
  { colKey: 'row-select', type: 'multiple', width: 64, fixed: 'left' },
  {
    title: '租户名称',
    align: 'left',
    width: 320,
    colKey: 'name',
    fixed: 'left',
  },
  {
    title: '租户编号',
    width: 160,
    ellipsis: true,
    colKey: 'no',
  },
  {
    title: '注册邮箱',
    width: 160,
    ellipsis: true,
    colKey: 'no',
  },
  { title: '状态', colKey: 'status', width: 160 },
  {
    title: '注册时间',
    width: 160,
    ellipsis: true,
    colKey: 'createdTime',
  },
  {
    align: 'left',
    fixed: 'right',
    width: 160,
    colKey: 'op',
    title: '操作',
  },
];
