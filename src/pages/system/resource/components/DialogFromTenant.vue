<template>
  <t-dialog header="新建资源" :width="1000" :footer="false">
    <template #body>
      <div>
        <div class="form-step-container">
          <!-- 简单步骤条 -->
          <t-card :bordered="false">
            <t-steps class="step-container" :current="1" status="process">
              <t-step-item title="资源注册" content="提交资源点" />
              <t-step-item title="资源详情" content="完善具体信息" />
            </t-steps>
          </t-card>

          <t-form
            v-show="activeForm === 0"
            class="step-form"
            :data="resourceData"
            :rules="FORM_RULES_RESOURCE"
            label-align="left"
            @submit="(result: SubmitContext) => onSubmit(result, 1)"
          >
            <t-form-item label="资源名称" name="name">
              <t-input v-model="resourceData.name" :style="{ width: '480px' }" placeholder="请输入资源名称" />
            </t-form-item>
            <t-form-item label="资源类型" name="type">
              <t-select v-model="resourceData.type" :style="{ width: '480px' }" class="demo-select-base" clearable>
                <t-option
                  v-for="(item, index) in RESOURCE_TYPE_OPTIONS"
                  :key="index"
                  :value="item.value"
                  :label="item.label"
                >
                  {{ item.label }}
                </t-option>
              </t-select>
            </t-form-item>
            <t-form-item>
              <t-button theme="primary" type="submit" :on-click="onSubmitResource"> 下一步 </t-button>
            </t-form-item>
          </t-form>

          <!-- 分步表单2 -->
          <t-form
            v-show="activeForm === 1"
            class="step-form"
            :data="resourceInfoData"
            :rules="FORM_RULES_MENU"
            label-width="150px"
            @submit="(result: SubmitContext) => onSubmit(result, 2)"
          >
            <t-form-item label="路由" name="path">
              <t-input
                v-model="resourceInfoData.path"
                :style="{ width: '580px' }"
                placeholder="是当前路由的路径，会与配置中的父级节点的 path 组成该页面路由的最终路径"
              />
            </t-form-item>
            <t-form-item
              label="路由名"
              name="name"
              help="多标签 Tab 页，如果要确保页面有 keep-alive 的能力，请保证该路由的name与对应页面（SFC)的name保持一致"
            >
              <t-input v-model="resourceInfoData.name" :style="{ width: '580px' }" placeholder="路由的name" />
            </t-form-item>
            <t-form-item label="组件" name="component">
              <t-input
                v-model="resourceInfoData.component"
                :style="{ width: '580px' }"
                placeholder="渲染该路由时使用的页面组件"
              />
            </t-form-item>
            <t-form-item label="重定向" name="redirect">
              <t-input v-model="resourceInfoData.redirect" :style="{ width: '580px' }" placeholder="重定向的路径" />
            </t-form-item>
            <t-form-item label="父路由" name="parentId">
              <t-tree-select
                v-model="resourceInfoData.parentId"
                style="width: 580px; display: inline-block; margin: 0 20px 20px 0"
                :data="menuTreeData"
                :keys="{ value: 'id', label: 'name' }"
                clearable
                filterable
                placeholder="-请选择父路由-"
                @click="loadingMenuTree"
              />
            </t-form-item>
            <t-divider>路由在菜单上展示的效果的配置</t-divider>
            <t-form-item label="标题" name="meta.title">
              <t-input
                v-model="resourceInfoData.meta.title"
                :style="{ width: '580px' }"
                placeholder="该路由在菜单上展示的标题"
              />
            </t-form-item>
            <t-form-item label="图标" name="meta.icon">
              <t-input
                v-model="resourceInfoData.meta.icon"
                :style="{ width: '580px' }"
                placeholder="该路由在菜单上展示的图标"
              />
            </t-form-item>
            <t-form-item label="排序" name="meta.orderNo">
              <t-input-number
                v-model="resourceInfoData.meta.orderNo"
                theme="normal"
                :min="0"
                :style="{ width: '580px' }"
                placeholder="该路由在菜单上展示先后顺序，数字越小越靠前，默认为零"
              />
            </t-form-item>
            <t-form-item label="iframe地址" name="meta.frameSrc">
              <t-input
                v-model="resourceInfoData.meta.frameSrc"
                :style="{ width: '580px' }"
                placeholder="请输入内嵌 iframe 的地址"
              />
            </t-form-item>
            <t-row justify="center">
              <t-col :span="5">
                <t-form-item label-width="170px" label="iframe是否新窗口打开" name="meta.frameBlank">
                  <t-switch
                    v-model="resourceInfoData.meta.frameBlank"
                    width="120px"
                    :label="[YES_NO_STATUS_LABEL.YES, YES_NO_STATUS_LABEL.NO]"
                    size="large"
                  >
                  </t-switch> </t-form-item
              ></t-col>
              <t-col :span="5">
                <t-form-item label-width="170px" label="是否默认展开" name="meta.expanded">
                  <t-switch
                    v-model="resourceInfoData.meta.expanded"
                    width="120px"
                    :label="[YES_NO_STATUS_LABEL.YES, YES_NO_STATUS_LABEL.NO]"
                    size="large"
                  >
                  </t-switch> </t-form-item
              ></t-col>
            </t-row>
            <t-row justify="center">
              <t-col :span="5">
                <t-form-item label-width="170px" label="是否隐藏" name="meta.hidden">
                  <t-switch
                    v-model="resourceInfoData.meta.hidden"
                    width="120px"
                    :label="[YES_NO_STATUS_LABEL.YES, YES_NO_STATUS_LABEL.NO]"
                    size="large"
                  >
                  </t-switch>
                </t-form-item>
              </t-col>
              <t-col :span="5">
                <t-form-item label-width="170px" label="是否隐藏面包屑" name="meta.hiddenBreadcrumb">
                  <t-switch
                    v-model="resourceInfoData.meta.hiddenBreadcrumb"
                    width="120px"
                    :label="[YES_NO_STATUS_LABEL.YES, YES_NO_STATUS_LABEL.NO]"
                    size="large"
                  >
                  </t-switch> </t-form-item
              ></t-col>
            </t-row>
            <t-row justify="center">
              <t-col :span="5">
                <t-form-item label-width="170px" label="是否单节点" name="meta.single">
                  <t-switch
                    v-model="resourceInfoData.meta.single"
                    width="120px"
                    :label="[YES_NO_STATUS_LABEL.YES, YES_NO_STATUS_LABEL.NO]"
                    size="large"
                  >
                  </t-switch>
                </t-form-item>
              </t-col>
              <t-col :span="5">
                <t-form-item label-width="170px" label="是否开启keep-alive" name="meta.keepAlive">
                  <t-switch
                    v-model="resourceInfoData.meta.keepAlive"
                    width="120px"
                    :label="[YES_NO_STATUS_LABEL.YES, YES_NO_STATUS_LABEL.NO]"
                    size="large"
                  >
                  </t-switch>
                </t-form-item>
              </t-col>
            </t-row>
            <t-row justify="center" style="margin-top: 20px">
              <t-col :span="2">
                <t-button theme="primary" type="submit" :on-click="onSubmitResourceInfo"> 确认 </t-button>
              </t-col>
            </t-row>
            <!-- <t-form-item style="margin-top: 20px; align-items: center; display: flex; justify-content: center">
              <t-button type="reset" theme="default" variant="base"> 上一步 </t-button>
              <t-button theme="primary" type="submit"> 确认 </t-button>
            </t-form-item> -->
          </t-form>
        </div>
      </div>
    </template>
  </t-dialog>
</template>

<script lang="ts">
export default {
  name: 'SystemResourceFormStep',
};
</script>

<script setup lang="ts">
import { SubmitContext } from 'tdesign-vue-next';
import { onBeforeUpdate, ref } from 'vue';

import { addMenu, getMenuTree } from '@/api/system/menu';
// import { useRouter } from 'vue-router';
import { RESOURCE_TYPE, RESOURCE_TYPE_OPTIONS, ResourceParam } from '@/api/system/model/resourceModel';
import { addResource } from '@/api/system/resource';
import { YES_NO_STATUS_LABEL } from '@/constants';

import { FORM_RULES_MENU, FORM_RULES_RESOURCE, RESOURCE_DATA, RESOURCE_INFO_DATA } from './constants';

const resourceData = ref<ResourceParam>({ ...RESOURCE_DATA });
const resourceInfoData = ref({ ...RESOURCE_INFO_DATA });
const activeForm = ref(1);
// 资源id
const resourceId = ref();
// 提交资源申请
const onSubmitResource = async () => {
  const { id } = await addResource({ name: resourceData.value.name, type: resourceData.value.type });
  resourceId.value = id;
};
const onSubmitResourceInfo = async () => {
  if (resourceData.value.type === RESOURCE_TYPE.MENU || resourceData.value.type === RESOURCE_TYPE.BUTTON) {
    const { parentId, path, name, component, redirect, meta } = resourceInfoData.value;
    await addMenu({ resourceId: resourceId.value, parentId, path, name, component, redirect, meta });
  }
};
// 提交下一步
const onSubmit = (result: SubmitContext, val: number) => {
  if (result.validateResult === true) {
    activeForm.value = val;
  }
};
// const onReset = (val: number) => {
//   console.log('执行回退');
//   if (val === 0) {
//     resourceInfoData.value.meta.expanded = 'YES';
//     resourceInfoData.value.meta.hidden = 'YES';
//     resourceInfoData.value.meta.hiddenBreadcrumb = 'YES';
//     resourceInfoData.value.meta.single = 'YES';
//     resourceInfoData.value.meta.frameBlank = 'YES';
//     resourceInfoData.value.meta.keepAlive = 'YES';
//   }
//   activeForm.value = val;
// };
// const complete = () => {
//   const router = useRouter();
//   router.replace({ path: '/detail/advanced' });
// };

// 每次打开弹框，控制表格步骤位置
const fatherProps = defineProps({
  activeFormFather: {
    type: Number,
    default: 0,
  },
});

// 在组件即将因为响应式状态变更而更新其 DOM 树之前调用
onBeforeUpdate(() => {
  activeForm.value = fatherProps.activeFormFather;
  activeForm.value = 1;
});

// 父菜单路由
const menuTreeData = [
  {
    name: '广东省',
    id: 'guangdong',
    children: [
      {
        name: '广州市',
        id: 'guangzhou',
      },
      {
        name: '深圳市',
        id: 'shenzhen',
      },
    ],
  },
  {
    name: '江苏省',
    value: 'jiangsu',
    children: [
      {
        name: '南京市',
        id: 'nanjing',
      },
      {
        name: '苏州市',
        id: 'suzhou',
      },
    ],
  },
];
const loadingMenuTree = async () => {
  console.log('加载菜单树');
  const menuTree = await getMenuTree();
  console.log(menuTree);
};
</script>

<style lang="less" scoped>
@import url('./index.less');
</style>
