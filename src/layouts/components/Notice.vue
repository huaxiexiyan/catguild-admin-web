<template>
  <t-popup expand-animation placement="bottom-right" trigger="click">
    <template #content>
      <div class="header-msg">
        <div class="header-msg-top">
          <p>通知中心</p>
          <t-button v-if="unreadMsg.length > 0" class="clear-btn" variant="text" theme="primary" @click="setRead('all')"
            >清空</t-button
          >
        </div>
        <t-list v-if="unreadMsg.length > 0" class="narrow-scrollbar" :split="false">
          <t-list-item v-for="(item, index) in unreadMsg" :key="index">
            <div>
              <p class="msg-content">{{ item.content }}</p>
              <p class="msg-type">{{ item.type }}</p>
            </div>
            <p class="msg-time">{{ item.date }}</p>
            <template #action>
              <t-button size="small" variant="outline" @click="setRead('radio', item)"> 设为已读 </t-button>
            </template>
          </t-list-item>
        </t-list>

        <div v-else class="empty-list">
          <img src="https://tdesign.gtimg.com/pro-template/personal/nothing.png" alt="空" />
          <p>暂无通知</p>
        </div>
        <div class="header-msg-bottom">
          <t-button
            v-if="unreadMsg.length > 0"
            class="header-msg-bottom-link"
            variant="text"
            theme="default"
            block
            @click="goDetail"
            >查看全部</t-button
          >
        </div>
      </div>
    </template>
    <t-badge :count="message.num" :offset="[4, 4]">
      <t-button theme="default" shape="square" variant="text">
        <t-icon name="mail" />
      </t-button>
    </t-badge>
  </t-popup>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { useNotificationStore } from '@/store';
import type { NotificationItem } from '@/types/interface';

const router = useRouter();
const store = useNotificationStore();
const { msgData, unreadMsg } = storeToRefs(store);

const setRead = (type: string, item?: NotificationItem) => {
  const changeMsg = msgData.value;
  if (type === 'all') {
    changeMsg.forEach((e) => {
      e.status = false;
    });
  } else {
    changeMsg.forEach((e) => {
      if (e.id === item?.id) {
        e.status = false;
      }
    });
  }
  store.setMsgData(changeMsg);
};

const goDetail = () => {
  router.push('/detail/secondary');
};

const message = ref({
  num: 0,
});

const refresh = () => {
  let source: EventSource = null;
  const userId = 7777;
  const message = ref({ num: null });

  if (window.EventSource) {
    // 建立连接
    source = new EventSource(`http://127.0.0.1:20000/api/auth/notices/connect/${userId}`);
    console.log(`连接用户=${userId}`);

    // 处理 open 事件
    const handleOpen = () => {
      console.log('建立连接...');
    };
    source.addEventListener('open', handleOpen, false);

    // 处理 message 事件
    const handleMessage = (e: { data: any }) => {
      console.log('收到消息', e.data);
      message.value.num = e.data;
    };
    source.addEventListener('message', handleMessage);

    // 处理 error 事件
    const handleError = (e: { readyState: number }) => {
      if (e.readyState === EventSource.CLOSED) {
        source.close();
      } else {
        console.log(e);
      }
    };
    source.addEventListener('error', handleError, false);

    // 在窗口关闭时关闭 SSE 连接
    const handleBeforeUnload = () => {
      closeSse();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    // 在组件销毁时取消事件监听
    onBeforeUnmount(() => {
      source.close();
      window.removeEventListener('beforeunload', handleBeforeUnload);
    });
  } else {
    console.log('你的浏览器不支持SSE');
  }

  // 关闭SSE连接
  const closeSse = () => {
    source.close();
    const httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', `/sse/close/${userId}`, true);
    httpRequest.send();
    console.log('close');
  };

  return {
    message,
  };
};

onMounted(() => {
  // refresh();
});
</script>

<style lang="less" scoped>
.header-msg {
  width: 400px;
  // height: 440px;
  margin: calc(0px - var(--td-comp-paddingTB-xs)) calc(0px - var(--td-comp-paddingLR-s));

  .empty-list {
    height: calc(100% - 120px);
    text-align: center;
    padding-top: 135px;
    font: var(--td-font-body-medium);
    color: var(--td-text-color-secondary);

    img {
      width: var(--td-comp-size-xxxxl);
    }

    p {
      margin-top: var(--td-comp-margin-xxl);
    }
  }

  &-top {
    position: relative;
    font: var(--td-font-title-medium);
    color: var(--td-text-color-primary);
    text-align: left;
    padding: var(--td-comp-paddingTB-l) var(--td-comp-paddingLR-xl) 0;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .clear-btn {
      right: calc(var(--td-comp-paddingTB-l) - var(--td-comp-paddingLR-xl));
    }
  }

  &-bottom {
    align-items: center;
    display: flex;
    justify-content: center;
    padding: var(--td-comp-paddingTB-s) var(--td-comp-paddingLR-s);
    border-top: 1px solid var(--td-component-stroke);

    &-link {
      text-decoration: none;
      cursor: pointer;
      color: var(--td-text-color-placeholder);
    }
  }

  .t-list {
    height: calc(100% - 104px);
    padding: var(--td-comp-margin-s) var(--td-comp-margin-s);
  }

  .t-list-item {
    overflow: hidden;
    width: 100%;
    padding: var(--td-comp-paddingTB-l) var(--td-comp-paddingLR-l);
    border-radius: var(--td-radius-default);
    font: var(--td-font-body-medium);
    color: var(--td-text-color-primary);
    cursor: pointer;
    transition: background-color 0.2s linear;

    &:hover {
      background-color: var(--td-bg-color-container-hover);

      .msg-content {
        color: var(--td-brand-color);
      }

      .t-list-item__action {
        button {
          bottom: var(--td-comp-margin-l);
          opacity: 1;
        }
      }

      .msg-time {
        bottom: -6px;
        opacity: 0;
      }
    }

    .msg-content {
      margin-bottom: var(--td-comp-margin-s);
    }

    .msg-type {
      color: var(--td-text-color-secondary);
    }

    .t-list-item__action {
      button {
        opacity: 0;
        position: absolute;
        right: var(--td-comp-margin-xxl);
        bottom: -6px;
      }
    }

    .msg-time {
      transition: all 0.2s ease;
      opacity: 1;
      position: absolute;
      right: var(--td-comp-margin-xxl);
      bottom: var(--td-comp-margin-l);
      color: var(--td-text-color-secondary);
    }
  }
}
</style>
