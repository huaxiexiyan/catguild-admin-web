import type { Tenant, TenantInfoParam, TenantPageParam, TenantPageResult } from '@/api/auth/model/tenantModel';
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

export function getTenantInfo(params: TenantInfoParam) {
  return request.get<Array<Tenant>>({
    url: `${Api.Tenant}/info`,
    params,
  });
}

export function updateTenantActiveStatus(id: string) {
  return request.patch({
    url: `${Api.Tenant}/${id}/switch-active-status`,
  });
}

export function getTenant(id: string) {
  return request.get<Tenant>({
    url: `${Api.Tenant}/${id}`,
  });
}

export function updateTenantAppConfig(id: string, data: Tenant) {
  return request.post({
    url: `${Api.Tenant}/${id}/sync-app-resource`,
    data,
  });
}
