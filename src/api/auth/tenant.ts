import type { Tenant, TenantPageParam, TenantPageResult } from '@/api/auth/model/tenantModel';
import { request } from '@/utils/request';

const Api = {
  TenantPage: '/auth/tenants',
  AddTenant: '/auth/tenants',
};

export function getTenantPage(params: TenantPageParam) {
  return request.get<TenantPageResult>({
    url: Api.TenantPage,
    params,
  });
}

export function addTenant(data: Tenant) {
  return request.post({
    url: Api.AddTenant,
    data,
  });
}
