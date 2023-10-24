import { FormRule } from 'tdesign-vue-next';

export const FORM_RULES_APP: Record<string, FormRule[]> = {
  name: [{ required: true, message: '请输入名称' }],
};
