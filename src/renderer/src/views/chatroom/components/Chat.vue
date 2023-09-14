<script setup lang="ts">
import { Message } from '..';
import { checkMessage } from '../util';
import { ElMessage, dayjs } from 'element-plus';
import { getLocalStorage } from '@renderer/util/storage';
import SocktUtil from '@renderer/util/socket';
import { GetMessageList } from '@renderer/api/index';
import { nextTick, onMounted, ref, watch } from 'vue';
import { useConfStore } from '@renderer/store/conf';
import { Folder } from '@element-plus/icons-vue';
import { UserInfo } from '@renderer/types';
// import { CallClient } from '@renderer/util/call';

const props = defineProps<{ otherUser: UserInfo }>();
watch(
  () => props.otherUser,
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
  if (message.code == 1 && message.data.fromUserName == props.otherUser.userName) {
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
  const message: Message = {
    fromUserName: currentUser.userName,
    createTime: new Date().getTime(),
    content: messageHtml,
    toUserName: props.otherUser.userName,
    type: 1
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
  GetMessageList({ userName: currentUser.userName, otherUserName: props.otherUser.userName }).then(
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
  document.oncopy = () => {};
});
const inputRef = ref<HTMLDivElement>();
const scrollRef = ref();

/**输入框粘贴事件 */
function pasteHandle(event: ClipboardEvent) {
  console.log(event.clipboardData?.files);

  event.preventDefault();
  const clipboardData = event.clipboardData;
  for (const item of clipboardData!.files) {
    if (item.type.includes('image')) {
      const image = new Image();
      image.src = item.path;
      let width = 0,
        height = 0;
      if (image.height > image.width) {
        height = 100;
        width = (100 * image.width) / image.height;
      } else {
        width = 100;
        height = (100 * image.height) / image.width;
      }
      image.style = 'margin-right:5px';
      image.height = height;
      image.width = width;

      const selection = window.getSelection();
      if (!selection?.rangeCount) return;
      selection.deleteFromDocument();
      selection.getRangeAt(0).insertNode(image);
      selection.collapseToEnd();
    }
  }

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

function keyupHandle(event: KeyboardEvent) {
  if (event.key == 'Enter' && event.ctrlKey) {
    sendMessage();
  }
}
// const client = new CallClient(currentUser.userName);
function onFileChange() {
  if (props.otherUser.isLogin) window.electron.ipcRenderer.send('open-file');
  else ElMessage.warning('对方在线时才能发送文件!');
}
function dropHandle(event: DragEvent) {
  event.stopPropagation();
  event.preventDefault();
  console.log(event.dataTransfer?.files);
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
            <div v-if="item.type == 1" class="info">{{ item.content }}</div>
            <div v-else-if="item.type == 2" class="info">{{ item.content }}</div>
          </div>
        </div>
      </el-scrollbar>
    </div>
    <div class="chat-input" @click="inputRef?.focus()">
      <div class="chat-operate">
        <el-icon title="上传文件" @click="onFileChange"><Folder /></el-icon>
      </div>
      <el-scrollbar ref="inputScrollRef" style="height: 119px; width: 100%">
        <div
          ref="inputRef"
          class="input"
          contenteditable
          spellcheck="false"
          @paste="pasteHandle"
          @keyup="keyupHandle"
          @drop="dropHandle"
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
          word-wrap: break-word;
          word-break: break-all;
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
    height: 119px;
    border-top: 1px solid #e8e8e8;
    padding: 10px;
    padding-bottom: 50px;
    position: relative;
    padding-top: 40px;
    .chat-operate {
      position: absolute;
      height: 30px;
      top: 5px;
      :hover {
        color: #0099ff;
      }
    }
    .input {
      width: auto;
      max-height: 119px;
      line-height: 30px;
      color: #000;
      white-space: pre-wrap;
      word-wrap: break-word;
      word-break: break-all;
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
