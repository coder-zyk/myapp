import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
export const useConfStore = defineStore('conf', () => {
  const conf = ref<{ serverAddress: string }>(window.api.conf);
  const isMax = ref<boolean>(false);
  const serverAddress = computed(() => {
    return conf.value.serverAddress;
  });
  return { conf, serverAddress, isMax };
});
