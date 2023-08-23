import { PageParam, PageResult } from '@/constants';

// 请求参数
export interface TenantPageParam extends PageParam {
  name: string;
}

export interface TenantPageResult extends PageResult {
  records: Array<Tenant>;
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
