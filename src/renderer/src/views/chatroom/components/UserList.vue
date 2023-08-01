<script setup lang="ts">
import { GetUserList } from '@renderer/api';
import { UserInfo } from '@renderer/types';
import { getSessionStorage } from '@renderer/util/storage';
import { ref } from 'vue';
const props = defineProps<{ modelValue: string }>();
const emits = defineEmits<{ 'update:modelValue': [modleValue: string] }>();
const currentUser = getSessionStorage('user');

const userList = ref<UserInfo[]>([]);
GetUserList({ userName: currentUser.userName }).then((res) => {
  userList.value = res.data as UserInfo[];
});
function clickHandle(item: UserInfo) {
  emits('update:modelValue', item.userName);
}
</script>
<template>
  <div class="dv-userlist">
    <div
      v-for="item in userList"
      :key="item.id"
      :class="`dv-user ${props.modelValue == item.userName ? 'active' : ''}`"
      @click="clickHandle(item)"
    >
      {{ item.userName }}
    </div>
  </div>
</template>
<style scoped lang="scss">
.dv-userlist {
  height: 100%;
  font-size: 16px;
  font-weight: 700;
  .dv-user {
    text-align: center;
    padding: 5px;
    &:hover {
      cursor: pointer;
      color: #fff;
      background-color: #409eff;
    }
  }
  .active {
    background-color: #409eff;
    color: #fff;
  }
}
</style>
