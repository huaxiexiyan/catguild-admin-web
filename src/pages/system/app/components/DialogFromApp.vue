<template>
  <t-dialog
    v-model:visible="formVisible"
    :header="dialogHeaderName"
    :width="680"
    :footer="false"
    :on-close="closeAddAppDialog"
  >
    <template #body>
      <t-form
        ref="formValidatorStatus"
        :data="formData"
        :rules="FORM_RULES_APP"
        :label-width="100"
        :status-icon="true"
        @submit="submitApp"
      >
        <t-form-item :label="dialogFromNameLabel" name="name" success-border>
          <t-input v-model="formData.name" :style="{ width: '480px' }" placeholder="请输入名称" />
        </t-form-item>
        <t-form-item v-if="!fatherProps.dialogIsMain" label="主应用" name="parentId">
          <t-select
            v-model="formData.parentApp.id"
            style="display: inline-block; width: 480px"
            :options="mainAppData"
            clearable
            filterable
            placeholder="-请选择主应用-"
            @click="loadingMainData"
          />
        </t-form-item>
        <t-form-item label="状态" name="activeStatus">
          <t-switch
            v-model="formData.activeStatus"
            size="large"
            :custom-value="[ACTIVE_STATUS.ACTIVE, ACTIVE_STATUS.INACTIVE]"
            :label="[ACTIVE_STATUS_LABEL.ACTIVE, ACTIVE_STATUS_LABEL.INACTIVE]"
          />
        </t-form-item>
        <t-form-item label="描述" name="describe">
          <t-textarea
            v-model="formData.describe"
            :style="{ width: '480px', minheight: '200px' }"
            :autosize="{ minRows: 8, maxRows: 10 }"
            :maxlength="500"
            placeholder="请输入内容"
            name="describe"
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
import { MessagePlugin } from 'tdesign-vue-next';
import { onMounted, PropType, ref } from 'vue';

import { addApp, getMainApp } from '@/api/system/app';
import { AppParam } from '@/api/system/model/appModel';
import { ACTIVE_STATUS, ACTIVE_STATUS_LABEL } from '@/constants';

import { FORM_RULES_APP } from './constantsApp';
// 父组件传值
const fatherProps = defineProps({
  dialogApp: {
    type: Object as PropType<{
      id: string;
      parentApp: { id: string };
      name: string;
      describe: string;
      activeStatus: ACTIVE_STATUS;
    }>,
  },
  dialogIsAdd: {
    type: Boolean,
    default: true,
  },
  dialogIsMain: {
    type: Boolean,
    default: true,
  },
});

const INITIAL_DATA: AppParam = {
  parentApp: { id: '0' },
  activeStatus: ACTIVE_STATUS.ACTIVE,
};

// 清空校验结果
const formValidatorStatus = ref(null);
const formData = ref({ ...INITIAL_DATA });
const formVisible = ref(false);

// 确认提交应用请求
const submitApp = async ({ validateResult, firstError }) => {
  if (validateResult === true) {
    await addApp(formData.value);
    MessagePlugin.success('提交成功');
    closeDialog();
  } else {
    console.log('Validate Errors: ', firstError, validateResult);
  }
};

// 添加应用弹框取消
const closeDialog = () => {
  console.log('关闭弹框');
  formData.value = { ...INITIAL_DATA };
  formValidatorStatus.value.reset();
  formValidatorStatus.value.clearValidate();
  console.log('通知父组件关闭弹框');
  closeAddAppDialog();
  console.log(`通知父组件关闭弹框后data${JSON.stringify(formData.value)}`);
};

// 传值父组件
const $emit = defineEmits(['closeAddAppDialog']);
const closeAddAppDialog = () => {
  $emit('closeAddAppDialog', false);
};

// 加载父应用
const mainAppData = ref([]);
const loadingMainData = async () => {
  await getMainApp().then((data) => {
    const mainApps: any[] = [];
    if (data != null) {
      data.forEach((app) => {
        mainApps.push({ value: app.id, label: app.name });
      });
      mainAppData.value = mainApps;
    }
  });
};

const dialogHeaderName = ref('');
const dialogFromNameLabel = ref('');
onMounted(() => {
  console.log(`构建弹框前data=${JSON.stringify(formData.value)}`);
  // 初始化页面构建元素
  let dialogHeaderNameValue = '';
  let dialogFromNameLabelValue = '';
  if (fatherProps.dialogIsAdd) {
    dialogHeaderNameValue = '新增';
    console.log('新增');
  } else {
    dialogHeaderNameValue = '编辑';
    console.log('编辑');
  }
  if (fatherProps.dialogIsMain) {
    dialogHeaderNameValue += '主应用';
    dialogFromNameLabelValue = '应用名';
    console.log('主应用');
  } else {
    dialogHeaderNameValue += '应用版本';
    dialogFromNameLabelValue = '版本名';
    console.log('应用版本');
  }
  dialogHeaderName.value = dialogHeaderNameValue;
  dialogFromNameLabel.value = dialogFromNameLabelValue;

  // 赋值初始化值
  loadingMainData();
  // 1、区分新增还是编辑
  if (fatherProps.dialogIsAdd && !fatherProps.dialogIsMain) {
    // 新增版本的时候默认填写下拉框
    formData.value.parentApp.id = fatherProps.dialogApp.parentApp.id;
  }
  // 编辑回显
  if (!fatherProps.dialogIsAdd) {
    if (fatherProps.dialogApp != null) {
      const { id, parentApp, name, describe, activeStatus } = fatherProps.dialogApp;
      formData.value = { id, name, describe, activeStatus, parentApp };
    }
  }
});
</script>
