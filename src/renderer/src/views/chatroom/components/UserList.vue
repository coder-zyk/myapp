<script setup lang="ts">
import { GetUserList } from '@renderer/api';
import { useSocketStore } from '@renderer/store/socket';
import { UserInfo } from '@renderer/types';
import { getLocalStorage } from '@renderer/util/storage';
import { ref, toRaw, watch } from 'vue';
const props = defineProps<{ modelValue: UserInfo }>();
const emits = defineEmits<{ 'update:modelValue': [modleValue: UserInfo] }>();
const currentUser = getLocalStorage('userInfo');
const userList = ref<UserInfo[]>([]);
GetUserList({ userName: currentUser.userName }).then((res) => {
  userList.value = res.data as UserInfo[];
});
function clickHandle(item: UserInfo) {
  item.count = 0;
  emits('update:modelValue', item);
}
watch(
  () => useSocketStore().messageData,
  (value) => {
    userList.value.map((item) => {
      if (item.userName == value.fromUserName && props.modelValue != value.fromUserName) {
        if (item.count) item.count++;
        else item.count = 1;
        window.electron.ipcRenderer.send('socket-message', toRaw(value));
      }
      return item;
    });
  },
  { deep: true }
);
</script>
<template>
  <div v-if="userList.length > 0" class="dv-userlist">
    <div
      v-for="item in userList"
      :key="item.id"
      :class="`dv-user ${props.modelValue.userName == item.userName ? 'active' : ''}`"
      @click="clickHandle(item)"
    >
      <div class="userinfo">
        <img src="/icon/user.png" alt="" class="image" />
        <span class="username">{{ item.userName }}</span>
        <span v-if="item.count" class="count">{{ item.count }}</span>
      </div>
      <div :class="item.isLogin ? 'online' : 'offline'"></div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.dv-userlist {
  height: 100%;
  .dv-user {
    padding: 5px;
    &:hover {
      cursor: pointer;
      color: #fff;
      background-color: #409eff;
    }

    > .userinfo {
      position: relative;
      display: flex;
      column-gap: 3px;
      font-size: 16px;
      font-weight: 600;
      > .image {
        width: 22px;
        height: 22px;
        border-radius: 50%;
      }
      > .username {
        width: calc(100% - 50px);
      }
      > .count {
        text-align: center;
        width: 22px;
        color: #fff;
        background-color: red;
        border-radius: 50%;
      }
    }
    > .online {
      &::before {
        content: '在线';
        color: green;
        font-size: 12px;
      }
    }
    > .offline {
      &::before {
        content: '离线';
        color: gray;
      }
    }
  }
  .active {
    background-color: #409eff;
    color: #fff;
  }
}
</style>
