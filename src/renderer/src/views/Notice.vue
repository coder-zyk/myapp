<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';
import { Message } from './chatroom';
import { useSocketStore } from '@renderer/store/socket';
function clickHandle() {
  window.electron.ipcRenderer.send('exit', 'notice');
}
watch(
  () => useSocketStore().messageData,
  (value) => {
    messageList.value.push(value);
    console.log(messageRef.value);
    nextTick(() => {
      messageRef.value.setScrollTop(messageRef.value.wrapRef.scrollHeight);
    });
  },
  { deep: true }
);
const messageList = ref<Message[]>([useSocketStore().messageData]);
const messageRef = ref();
</script>
<template>
  <div class="dv-notice">
    <div class="operate">
      <div class="iconfont icon-guanbi1 close" @click="clickHandle"></div>
    </div>
    <div class="message">
      <el-scrollbar ref="messageRef">
        <div v-for="(item, index) in messageList" :key="index" class="message-item">
          <div class="user" :title="item.fromUserName">{{ item.fromUserName }}</div>
          <div class="content">{{ item.content }}</div>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>
<style scoped lang="scss">
.dv-notice {
  .operate {
    display: flex;
    justify-content: flex-end;
    height: 20px;
    > .close {
      margin-right: 5px;
      padding: 2px;
      height: 16px;
      width: 16px;
      &:hover {
        background-color: red;
        color: #fff;
      }
    }
  }
  .message {
    height: 170px;
    padding: 5px 10px;
    .message-item {
      display: flex;

      > .user {
        width: 60px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
      > .content {
        width: 200px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }
  }
}
</style>
