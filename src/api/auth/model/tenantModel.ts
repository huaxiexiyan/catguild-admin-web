// 请求参数
export interface TenantPageParam extends PageParam {
  name: string;
}

export interface TenantPageResult extends PageResult {
  records: Array<Tenant>;
}

// 通用分页参数
export interface PageResult {
  current: number;
  size: number;
  total: number;
}

export interface PageParam {
  current: number;
  size: number;
}

// 返回参数
export interface Tenant {
  name: string;
  code: string;
  email: string;
  remarks: string;
  status: string;
  createdTime: Date;
}
