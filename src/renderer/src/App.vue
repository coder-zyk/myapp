<script setup lang="ts">
import { onMounted } from 'vue';
import { onMessageByMain } from './util/ipc';

onMounted(() => {
  console.log(12213);

  onMessageByMain();
});
</script>

<template>
  <RouterView />
</template>

<style lang="scss">
@import './assets/css/styles.scss';
</style>
