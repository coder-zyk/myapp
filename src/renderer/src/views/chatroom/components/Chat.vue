<script setup lang="ts">
import { Message } from '..';
import { checkMessage } from '../util';
import { dayjs } from 'element-plus';
import { getLocalStorage } from '@renderer/util/storage';
import SocktUtil from '@renderer/util/socket';
import { GetMessageList } from '@renderer/api/index';
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { useConfStore } from '@renderer/store/conf';
const props = defineProps<{ otherUserName: string }>();
watch(
  () => props.otherUserName,
  (value) => {
    if (value) {
      messageList.value = [];
      getMessageList();
    }
  },
  { deep: true }
);
const socket = new SocktUtil(`ws://${useConfStore().serverAddress}/websocket?token=zyk`);
const currentUser = getLocalStorage('userInfo');
function onMessage(message) {
  if (message.code == 1) {
    messageList.value.push(message.data);
    nextTick(() => {
      scrollRef.value.setScrollTop(scrollRef.value.wrapRef.scrollHeight);
    });
  }
}
socket.on('message', onMessage);
const messageList = ref<Message[]>([]);
function sendMessage() {
  let messageHtml = inputRef.value!.innerText!;
  messageHtml = checkMessage(messageHtml);
  const message = {
    fromUserName: currentUser.userName,
    createTime: new Date().getTime(),
    content: messageHtml,
    toUserName: props.otherUserName
  };
  if (messageHtml) {
    messageList.value.push(message);
    socket.send({
      code: 1,
      data: message
    });
  }
  inputRef.value!.innerHTML = '';

  nextTick(() => {
    scrollRef.value.setScrollTop(scrollRef.value.wrapRef.scrollHeight);
    inputRef.value?.focus();
  });
}
/**获取消息列表 */
function getMessageList() {
  GetMessageList({ userName: currentUser.userName, otherUserName: props.otherUserName }).then(
    (res) => {
      messageList.value = res.data as Message[];
      nextTick(() => {
        scrollRef.value.setScrollTop(scrollRef.value.wrapRef.scrollHeight);
        inputRef.value?.focus();
      });
    }
  );
}
onMounted(() => {
  getMessageList();
});
const inputRef = ref<HTMLDivElement>();
const scrollRef = ref();
/**输入框粘贴事件 */
function pasteHandle(event: ClipboardEvent) {
  event.preventDefault();
  const data = event.clipboardData?.getData('text');
  const selection = window.getSelection();
  if (!selection?.rangeCount) return;
  selection.deleteFromDocument();
  selection.getRangeAt(0).insertNode(document.createTextNode(data!));
  selection.collapseToEnd();
  nextTick(() => {
    inputScrollRef.value.setScrollTop(inputScrollRef.value.wrapRef.scrollHeight);
  });
}
/**鼠标移出聊天记录是,清空选中 */
function mouseleavetHandle(_event: MouseEvent) {
  if (_event.buttons == 1) {
    document.getSelection()?.empty();
  }
}
const inputScrollRef = ref();
onUnmounted(() => {
  // socket.close()
});
function keyupHandle(event: KeyboardEvent) {
  if (event.key == 'Enter' && event.ctrlKey) {
    sendMessage();
  }
}
</script>
<template>
  <div class="dv-chat">
    <div class="chat-list">
      <el-scrollbar ref="scrollRef" style="height: 100%; width: 100%">
        <div
          v-for="item in messageList"
          :key="item.createTime"
          :class="`chat-list-item ${item.fromUserName == currentUser.userName ? 'right' : 'left'}`"
          @mouseleave="mouseleavetHandle"
        >
          <div class="avatar"><img src="/icon/user.png" alt="" draggable="false" /></div>
          <div class="content">
            <div class="time">{{ dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss') }}</div>
            <div class="info">{{ item.content }}</div>
          </div>
        </div>
      </el-scrollbar>
    </div>
    <div class="chat-input" @click="inputRef?.focus()">
      <el-scrollbar ref="inputScrollRef" style="height: 149px">
        <div
          ref="inputRef"
          class="input"
          contenteditable
          @paste="pasteHandle"
          @keyup="keyupHandle"
        ></div>
      </el-scrollbar>
    </div>
    <div class="chat-send">
      <el-button type="primary" @click="sendMessage">发送</el-button>
    </div>
  </div>
</template>
<style scoped lang="scss">
.dv-chat {
  height: 100%;
  position: relative;
  background-color: #f2f2f2;
  .chat-list {
    height: calc(100% - 210px);
    width: 100%;
    display: grid;
    .chat-list-item {
      display: flex;
      width: calc(100% - 20px);
      padding: 0px 10px;
      gap: 10px;
      margin-top: 10px;
      margin-bottom: 10px;
      user-select: none;
      .avatar {
        width: 40px;
        height: 40px;
        user-select: none;
        & > img {
          height: 100%;
          width: 100%;
          border-radius: 50%;
          user-select: none;
        }
      }
      .content {
        max-width: calc(100% - 120px);
        display: grid;
        justify-items: start;
        .time {
          color: #6c6c6c;
        }
        .info {
          max-width: calc(100% - 0px);
          background-color: #fff;
          color: #000;
          border-radius: 5px;
          padding: 10px;
          user-select: text;
          white-space: pre-wrap;
        }
      }
    }

    .right {
      flex-direction: row-reverse;
      color: #fff;
      .content {
        justify-items: end;
        .info {
          background-color: #0099ff;
          color: #fff;
        }
      }
    }
  }
  .chat-input {
    height: 149px;
    border-top: 1px solid #e8e8e8;
    padding: 10px;
    padding-bottom: 50px;
    .input {
      min-height: 149px;
      color: #000;
      white-space: pre-wrap;
      &:focus-visible {
        outline: unset;
      }
    }
  }
  .chat-send {
    position: absolute;
    bottom: 10px;
    right: 10px;
    width: 70px;
    .el-button {
      width: 100%;
    }
  }
}
</style>
