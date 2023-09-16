<template>
  <t-dialog v-model:visible="formVisible" :header="fatherProps.dialogHeaderValue" :width="680" :footer="false">
    <template #body>
      <!-- 表单内容 -->
      <t-form
        ref="formValidatorStatus"
        :data="formData"
        :rules="FORM_RULES_APP"
        :label-width="100"
        :status-icon="true"
        @submit="submitApp"
      >
        <t-form-item label="应用名" name="name" success-border>
          <t-input v-model="formData.name" :style="{ width: '480px' }" placeholder="请输入名称" />
        </t-form-item>
        <t-form-item label="状态" name="status">
          <t-switch
            v-model="formData.status"
            size="large"
            :custom-value="[ACTIVE_STATUS.ACTIVE, ACTIVE_STATUS.INACTIVE]"
            :label="[ACTIVE_STATUS_LABEL.ACTIVE, ACTIVE_STATUS_LABEL.INACTIVE]"
          />
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
        <t-row justify="end">
          <t-col :span="5">
            <t-form-item>
              <t-button variant="outline" @click="closeDialog">取消</t-button>
              <t-button theme="primary" type="submit">确定</t-button>
            </t-form-item>
          </t-col>
        </t-row>
      </t-form>
    </template>
  </t-dialog>
</template>

<script setup lang="ts">
import { FormRules, MessagePlugin, SubmitContext } from 'tdesign-vue-next';
import { ref, watch } from 'vue';

import { addApp } from '@/api/system/app';
import { AppParam } from '@/api/system/model/appModel';
import { ACTIVE_STATUS, ACTIVE_STATUS_LABEL } from '@/constants';

import { FORM_RULES_APP } from './constantsApp';
// 父组件传值
const fatherProps = defineProps({
  dialogHeaderValue: {
    type: String,
    default: '新增主应用',
  },
});

const INITIAL_DATA: AppParam = {
  name: '',
  remarks: '',
  status: ACTIVE_STATUS.ACTIVE,
};

// 清空校验结果
const formValidatorStatus = ref(null);
const formData = ref({ ...INITIAL_DATA });
const formVisible = ref(false);

// 清除校验结果
const handleClear = () => {
  formValidatorStatus.value.reset();
  formValidatorStatus.value.clearValidate();
};

// 确认提交应用请求
const submitApp = async () => {
  await addApp(formData.value);
  closeDialog();
};

// 添加应用弹框取消
const closeDialog = () => {
  closeAddAppDialog();
  formData.value = { ...INITIAL_DATA };
  handleClear();
};

// 传值父组件
const $emit = defineEmits(['closeAddAppDialog']);
const closeAddAppDialog = () => {
  $emit('closeAddAppDialog', false);
};
</script>
