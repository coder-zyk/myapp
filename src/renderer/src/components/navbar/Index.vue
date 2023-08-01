<script setup lang="ts">
import { User, ChatDotRound, Reading } from '@element-plus/icons-vue';
import router from '@renderer/router';
import { DefineComponent, ref } from 'vue';
/**当前活跃的菜单索引 */
const activeIndex = ref(1);
type Menu = {
  id: number;
  title: string;
  icon: DefineComponent;
  path: string;
};
const menus: Menu[] = [
  {
    id: 1,
    title: '用户',
    icon: User,
    path: '/'
  },
  {
    id: 2,
    title: '学习',
    icon: Reading,
    path: '/subject/math'
  },
  {
    id: 3,
    title: '聊天',
    icon: ChatDotRound,
    path: '/chat'
  }
];
function clickHandle(item: Menu) {
  activeIndex.value = item.id;
  router.push(item.path);
}
</script>
<template>
  <div class="dv-navbar">
    <div
      v-for="item in menus"
      :key="item.id"
      :class="`dv-navbar-item ${activeIndex == item.id ? 'active' : ''}`"
      @click="clickHandle(item)"
    >
      <el-icon :size="26"><component :is="item.icon" /></el-icon>
    </div>
  </div>
</template>
<style scoped lang="scss">
.dv-navbar {
  width: 100%;
  background-color: #f2f2f2;
  .dv-navbar-item {
    padding: 7px 7px;
    height: 26px;
    cursor: pointer;
    border-radius: 5px;
    & + .dv-navbar-item {
      margin-top: 10px;
    }
    &:hover {
      background-color: #e3e3e3;
    }
    &.active {
      background-color: #e3e3e3;
    }
  }
}
</style>
