import type { Tenant, TenantPageParam, TenantPageResult } from '@/api/auth/model/tenantModel';
import { request } from '@/utils/request';

const Api = {
  Tenant: '/auth/tenants',
};

export function getTenantPage(params: TenantPageParam) {
  return request.get<TenantPageResult>({
    url: Api.Tenant,
    params,
  });
}

export function addTenant(data: Tenant) {
  return request.post({
    url: Api.Tenant,
    data,
  });
}

export function getTenantInfo() {
  return request.get<Tenant>({
    url: `${Api.Tenant}/info`,
  });
}
