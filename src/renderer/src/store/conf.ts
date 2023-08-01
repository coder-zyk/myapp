import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
export const useConfStore = defineStore('conf', () => {
  const conf = ref<{ serverAddress: string }>();
  const serverAddress = computed(() => {
    return conf.value?.serverAddress ?? '192.168.1.2:3000';
  });
  return { conf, serverAddress };
});
