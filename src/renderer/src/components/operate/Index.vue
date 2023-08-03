<script setup lang="ts">
import { useConfStore } from '@renderer/store/conf';
const operateList = [
  {
    id: 1,
    title: '最小化',
    className: 'icon-2zuixiaohua-1'
  },
  {
    id: 2,
    title: '最大化',
    className: 'icon-3zuidahua-1'
  },
  {
    id: 3,
    title: '关闭',
    className: 'icon-guanbi1'
  }
];
function clickHandle(_event: Event, index: number) {
  switch (index) {
    case 1:
      window.electron.ipcRenderer.send('min');
      break;
    case 2:
      window.electron.ipcRenderer.send('max', true);
      break;
    case 3:
      window.electron.ipcRenderer.send('close');
      break;
    default:
      break;
  }
}
</script>
<template>
  <div class="dv-operate iconfont">
    <div
      v-for="item in operateList"
      :key="item.id"
      class="dv-operate-item"
      @click="clickHandle($event, item.id)"
    >
      <div v-if="useConfStore().isMax && item.id == 2" class="icon-3zuidahua-3"></div>
      <div v-else :class="item.className"></div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.dv-operate {
  -webkit-app-region: drag;
  display: flex;
  justify-content: flex-end;
  .dv-operate-item {
    -webkit-app-region: no-drag;
    height: 16px;
    padding: 7px 12px;
    &:hover {
      background-color: #f1f1f1;
      cursor: pointer;
      color: #a19a9a;
    }
    &:nth-child(3):hover {
      background-color: red;
      color: #fff;
    }
  }
}
</style>
