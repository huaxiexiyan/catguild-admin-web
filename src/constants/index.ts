// 合同状态枚举
export const CONTRACT_STATUS = {
  FAIL: 0,
  AUDIT_PENDING: 1,
  EXEC_PENDING: 2,
  EXECUTING: 3,
  FINISH: 4,
};

export const CONTRACT_STATUS_OPTIONS = [
  { value: CONTRACT_STATUS.FAIL, label: '审核失败' },
  { value: CONTRACT_STATUS.AUDIT_PENDING, label: '待审核' },
  { value: CONTRACT_STATUS.EXEC_PENDING, label: '待履行' },
  { value: CONTRACT_STATUS.EXECUTING, label: '审核成功' },
  { value: CONTRACT_STATUS.FINISH, label: '已完成' },
];

// 合同类型枚举
export const CONTRACT_TYPES = {
  MAIN: 0,
  SUB: 1,
  SUPPLEMENT: 2,
};

export const CONTRACT_TYPE_OPTIONS = [
  { value: CONTRACT_TYPES.MAIN, label: '主合同' },
  { value: CONTRACT_TYPES.SUB, label: '子合同' },
  { value: CONTRACT_TYPES.SUPPLEMENT, label: '补充合同' },
];

// 合同收付类型枚举
export const CONTRACT_PAYMENT_TYPES = {
  PAYMENT: 0,
  RECEIPT: 1,
};

// 标签类型
type TagTheme = 'default' | 'success' | 'primary' | 'warning' | 'danger';
// 通知的优先级对应的标签类型
export const NOTIFICATION_TYPES: Map<string, TagTheme> = new Map([
  ['low', 'primary'],
  ['middle', 'warning'],
  ['high', 'danger'],
]);

// 通用请求头
export enum ContentTypeEnum {
  Json = 'application/json;charset=UTF-8',
  FormURLEncoded = 'application/x-www-form-urlencoded;charset=UTF-8',
  FormData = 'multipart/form-data;charset=UTF-8',
}

// 统用二意状态
export enum ACTIVE_STATUS {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export const ACTIVE_STATUS_STRING = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
};
export const ACTIVE_STATUS_LABEL = {
  ACTIVE: '活跃',
  INACTIVE: '冻结',
};
export const ACTIVE_STATUS_OPTIONS = [
  { value: ACTIVE_STATUS.ACTIVE, label: ACTIVE_STATUS_LABEL.ACTIVE },
  { value: ACTIVE_STATUS.INACTIVE, label: ACTIVE_STATUS_LABEL.INACTIVE },
];

export enum YES_NO_STATUS {
  YES = 'YES',
  NO = 'NO',
}

export const YES_NO_STATUS_STRING = {
  YES: 'YES',
  NO: 'NO',
};
export const YES_NO_STATUS_LABEL = {
  YES: '是',
  NO: '否',
};
export const YES_NO_STATUS_OPTIONS = [
  { label: YES_NO_STATUS_LABEL.YES, value: YES_NO_STATUS.YES },
  { label: YES_NO_STATUS_LABEL.NO, value: YES_NO_STATUS.NO },
];

// 通用分页参数请求
export interface PageParam {
  current: number;
  size: number;
}
// 通用的分页响应
export interface PageResult {
  current: number;
  size: number;
  total: number;
}
