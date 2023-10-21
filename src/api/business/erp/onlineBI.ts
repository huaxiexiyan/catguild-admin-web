import type { OnlineChartParam, OnlineChartResult } from '@/api/business/erp/model/onlineBIModel';
import { request } from '@/utils/request';

const Api = {
  OnlineBI: '/business/erp/online/bi',
};
// 获取分页列表
export function getOnlineChartData(params: OnlineChartParam) {
  return request.get<OnlineChartResult>({
    url: `${Api.OnlineBI}/sales-line-chart`,
    params,
  });
}
