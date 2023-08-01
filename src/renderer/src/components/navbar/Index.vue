<script setup lang="ts">
import { User, ChatDotRound, Reading, Setting } from '@element-plus/icons-vue';
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
const showSetting = ref<boolean>(false);
function checkUpdate() {
  showSetting.value = false;
  window.electron.ipcRenderer.send('check-update');
}
</script>
<template>
  <div class="dv-navbar">
    <div class="top">
      <div
        v-for="item in menus"
        :key="item.id"
        :class="`dv-navbar-item ${activeIndex == item.id ? 'active' : ''}`"
        @click="clickHandle(item)"
      >
        <el-icon :size="26"><component :is="item.icon" /></el-icon>
      </div>
    </div>
    <div class="bottom">
      <div class="setting">
        <el-popover
          v-model:visible="showSetting"
          :teleported="false"
          popper-style="padding:10px;min-width:100px"
          placement="top-start"
          :width="100"
          trigger="click"
        >
          <template #reference>
            <el-icon :size="26"><component :is="Setting" /></el-icon>
          </template>
          <div class="content">
            <div class="content-item" @click="checkUpdate">检查更新</div>
          </div>
        </el-popover>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.dv-navbar {
  width: 100%;
  background-color: #f2f2f2;
  display: grid;
  align-content: space-between;
  .top {
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
  .bottom {
    .setting {
      text-align: center;
      &:hover {
        cursor: pointer;
        color: #529bd9;
      }
      .content {
        font-size: 16px;
        .content-item {
          cursor: pointer;
          &:hover {
            background-color: #e3e3e3;
          }
        }
      }
    }
  }
}
</style>
