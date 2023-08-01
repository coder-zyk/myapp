<script setup lang="ts">
import UserList from './components/UserList.vue';
import Chat from './components/Chat.vue';
import { ref } from 'vue';
const otherUserName = ref('');
</script>
<template>
  <div class="dv-chat-room">
    <div class="dv-userList-container">
      <UserList v-model="otherUserName"></UserList>
    </div>
    <div class="dv-chat-container">
      <Chat v-if="otherUserName" :other-user-name="otherUserName"></Chat>
      <el-empty v-else></el-empty>
    </div>
  </div>
</template>
<style scoped lang="scss">
.dv-chat-room {
  display: flex;
  height: 100%;
  .dv-userList-container {
    width: 80px;
  }
  .dv-chat-container {
    flex: auto;
  }
}
</style>
