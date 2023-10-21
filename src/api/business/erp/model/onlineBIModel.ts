export interface OnlineChartParam {
  timeScale: TIME_SCALE;
  type: STATISTICS_TYPE;
}

export interface OnlineChartResult {
  timeScale: TIME_SCALE;
  type: STATISTICS_TYPE;
  data: Record<string, number>;
  salesVolume: number;
  salesRevenue: number;
  orderQuantity: number;
}

export enum TIME_SCALE {
  WEEK = 'WEEK',
  LAST_WEEK = 'LAST_WEEK',
  MONTH = 'MONTH',
  LAST_MONTH = 'LAST_MONTH',
  YEAR = 'YEAR',
  LAST_YEAR = 'LAST_YEAR',
}

export const TIME_SCALE_LABEL = {
  WEEK: '当周',
  LAST_WEEK: '上周',
  MONTH: '当月',
  LAST_MONTH: '上月',
  YEAR: '当年',
  LAST_YEAR: '上年',
};

export const TIME_SCALE_OPTIONS = [
  { label: TIME_SCALE_LABEL.WEEK, value: TIME_SCALE.WEEK },
  { label: TIME_SCALE_LABEL.LAST_WEEK, value: TIME_SCALE.LAST_WEEK },
  { label: TIME_SCALE_LABEL.MONTH, value: TIME_SCALE.MONTH },
  { label: TIME_SCALE_LABEL.LAST_MONTH, value: TIME_SCALE.LAST_MONTH },
  { label: TIME_SCALE_LABEL.YEAR, value: TIME_SCALE.YEAR },
  { label: TIME_SCALE_LABEL.LAST_YEAR, value: TIME_SCALE.LAST_YEAR },
];

export enum STATISTICS_TYPE {
  SALES_REVENUE = 'SALES_REVENUE',
  ORDER_QUANTITY = 'ORDER_QUANTITY',
  SALES_VOLUME = 'SALES_VOLUME',
}

export const STATISTICS_TYPE_LABEL = {
  SALES_REVENUE: '销售额',
  ORDER_QUANTITY: '订单量',
  SALES_VOLUME: '销售量',
};

export const STATISTICS_TYPE_OPTIONS = [
  { label: STATISTICS_TYPE_LABEL.SALES_REVENUE, value: STATISTICS_TYPE.SALES_REVENUE },
  { label: STATISTICS_TYPE_LABEL.ORDER_QUANTITY, value: STATISTICS_TYPE.ORDER_QUANTITY },
  { label: STATISTICS_TYPE_LABEL.SALES_VOLUME, value: STATISTICS_TYPE.SALES_VOLUME },
];
