<script setup lang="ts">
import { useUpdateStore } from '@renderer/store/update';
import { watch } from 'vue';

watch(
  () => useUpdateStore().updateInfo,
  (value) => {
    console.log(value);
  },
  { deep: true }
);
</script>
<template>
  <div class="dv-update">
    <el-progress :percentage="+useUpdateStore().updateInfo.percent.toFixed(2)"></el-progress>
  </div>
</template>
<style scoped lang="scss">
.dv-update {
  height: 100vh;
  padding: 0px 10px;
  display: grid;
}
</style>
