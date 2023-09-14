<script setup lang="ts">
import UserList from './components/UserList.vue';
import Chat from './components/Chat.vue';
import { ref } from 'vue';
import { UserInfo } from '@renderer/types';
const otherUser = ref<UserInfo>({
  id: 0,
  isLogin: 1,
  userName: '',
  count: 0
});
</script>
<template>
  <div class="dv-chat-room">
    <div class="dv-userList-container">
      <UserList v-model="otherUser"></UserList>
    </div>
    <div class="dv-chat-container">
      <Chat v-if="otherUser.id" :other-user="otherUser"></Chat>
      <el-empty v-else description="请选择用户"></el-empty>
    </div>
  </div>
</template>
<style scoped lang="scss">
.dv-chat-room {
  display: flex;
  height: 100%;
  .dv-userList-container {
    width: 100px;
  }
  .dv-chat-container {
    flex: 1;
  }
}
</style>
