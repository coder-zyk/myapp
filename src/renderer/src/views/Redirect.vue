<script setup lang="ts">
import NavBar from '@renderer/components/navbar/Index.vue';
import Operate from '@renderer/components/operate/Index.vue';
import router from '@renderer/router';
import { useConfStore } from '@renderer/store/conf';
import { useSocketStore } from '@renderer/store/socket';
import SocktUtil from '@renderer/util/socket';
import { getLocalStorage } from '@renderer/util/storage';
import { onUnmounted } from 'vue';
const currentUser = getLocalStorage('userInfo');
const socket = new SocktUtil(`ws://${useConfStore().serverAddress}/websocket?token=zyk`);
function onOpen(event) {
  console.log(event, 'open');
  socket.send({
    code: 5,
    userName: currentUser.userName
  });
}
function onClose(event) {
  console.log(event, 'close');
  socket.clear();
}
function onMessage(message) {
  if (message.code == 1) {
    useSocketStore().messageData = message.data;
    if (router.currentRoute.value.path != '/chat') {
      window.electron.ipcRenderer.send('socket-message', message.data);
    }
  }
}
socket.on('open', onOpen);
socket.on('close', onClose);
socket.on('message', onMessage);
onUnmounted(() => {
  socket.off('open', onOpen);
  socket.off('close', onClose);
});
</script>
<template>
  <div class="dv-container">
    <NavBar class="dv-navbar-container"></NavBar>
    <div class="dv-right">
      <div class="dv-operate-container">
        <Operate></Operate>
      </div>
      <div class="dv-main-container">
        <RouterView />
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.dv-container {
  height: 100vh;
  display: flex;
  .dv-navbar-container {
    width: 40px;
    padding: 5px 10px;
  }
  .dv-right {
    flex: auto;
    .dv-operate-container {
      text-align: right;
      height: 30px;
    }
    .dv-main-container {
      flex: 1;
      height: calc(100% - 30px);
    }
  }
}
</style>
