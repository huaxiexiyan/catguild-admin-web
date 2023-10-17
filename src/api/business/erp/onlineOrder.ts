import type { OnlineOrderPageParam, OnlineOrderPageResult } from '@/api/business/erp/model/onlineOrderModel';
import { request } from '@/utils/request';

const Api = {
  OnlineOrder: '/business/erp/online/orders',
};
// 获取分页列表
export function getOnlineOrderPage(params: OnlineOrderPageParam) {
  return request.get<OnlineOrderPageResult>({
    url: Api.OnlineOrder,
    params,
  });
}
