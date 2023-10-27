import { PageParam, PageResult } from '@/constants';

// 请求参数
export interface TenantPageParam extends PageParam {
  name: string;
  uid: number;
  activeStatus: string;
}

export interface TenantInfoParam {
  domainName: string;
}

export interface TenantPageResult extends PageResult {
  records: Array<Tenant>;
}

// 返回参数
export interface Tenant {
  id?: string;
  name?: string;
  code?: string;
  email?: string;
  remarks?: string;
  activeStatus?: string;
  domainName?: string;
  ctime?: Date;
  appIds?: Array<string>;
}
