<template>
  <t-dialog v-model:visible="formVisible" header="新建产品" :width="680" :footer="false">
    <template #body>
      <!-- 表单内容 -->
      <t-form
        ref="formValidatorStatus"
        :data="formData"
        :rules="rules"
        :label-width="100"
        :status-icon="true"
        @submit="onSubmit"
      >
        <t-form-item label="名称" name="name" success-border>
          <t-input v-model="formData.name" :style="{ width: '480px' }" placeholder="请输入名称" />
        </t-form-item>
        <!-- <t-form-item label="编号" name="code" :disabled="true">
          <t-input v-model="formData.code" :style="{ width: '480px' }" />
        </t-form-item> -->
        <t-form-item label="邮箱" name="email" success-border>
          <t-input v-model="formData.email" :style="{ width: '480px' }" />
        </t-form-item>
        <t-form-item label="备注" name="remarks">
          <t-textarea
            v-model="formData.remarks"
            :style="{ width: '480px', minheight: '200px' }"
            :autosize="{ minRows: 8, maxRows: 10 }"
            :maxlength="500"
            placeholder="请输入内容"
            name="remarks"
          />
        </t-form-item>
        <!-- <t-form-item label="状态" name="status">
          <t-switch v-model="formData.status" size="large" :label="['启用', '停用']" />
        </t-form-item> -->
        <t-form-item style="float: right">
          <t-button variant="outline" @click="onClickCloseBtn">取消</t-button>
          <t-button theme="primary" type="submit">确定</t-button>
        </t-form-item>
      </t-form>
    </template>
  </t-dialog>
</template>

<script setup lang="ts">
import { FormRules, MessagePlugin, SubmitContext } from 'tdesign-vue-next';
import type { PropType } from 'vue';
import { ref, watch } from 'vue';

import { Tenant } from '@/api/auth/model/tenantModel';
import { addTenant } from '@/api/auth/tenant';

// 默认值
const INITIAL_DATA: Tenant = {
  name: undefined,
  email: undefined,
  status: undefined,
  code: undefined,
  remarks: undefined,
  createdTime: undefined,
};

// const SELECT_OPTIONS = [
//   { label: '网关', value: '1' },
//   { label: '人工智能', value: '2' },
//   { label: 'CVM', value: '3' },
// ];

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  data: Object as PropType<FormData>,
});
const formVisible = ref(false);
const formData = ref({ ...INITIAL_DATA });

const onSubmit = ({ validateResult, firstError }: SubmitContext<FormData>) => {
  if (!firstError) {
    addTenant(formData.value)
      .then(() => {
        // 成功了
        formVisible.value = false;
        MessagePlugin.success('提交成功');
        // 清空校验规则
        handleClear();
        // 清空已填写的值
        formValidatorStatus.value.reset();
      })
      .catch((res) => {
        if (res.response.status === 500) {
          MessagePlugin.error('系统异常');
        }
      });
  } else {
    console.log('Errors: ', validateResult);
  }
};

const onClickCloseBtn = () => {
  formVisible.value = false;
  handleClear();
};

const emit = defineEmits(['update:visible']);
watch(
  () => formVisible.value,
  (val) => {
    emit('update:visible', val);
  },
);

watch(
  () => props.visible,
  (val) => {
    formVisible.value = val;
  },
);

watch(
  () => props.data,
  (val) => {
    formData.value = val;
  },
);

// 校验规则
const rules = {
  name: [{ required: true, message: '请输入产品名称', type: 'error' }],
  email: [
    { required: true, message: '请输入邮箱', type: 'error' },
    { email: { ignore_max_length: true }, message: '请输入正确的邮箱地址', type: 'warning' },
  ],
};

// 清空校验结果
const formValidatorStatus = ref(null);
const handleClear = () => {
  formValidatorStatus.value.clearValidate();
};
</script>
