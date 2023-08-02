import { ProgressInfo } from 'electron-updater';
import { defineStore } from 'pinia';
import { ref } from 'vue';
export const useUpdateStore = defineStore('update', () => {
  const updateInfo = ref<ProgressInfo>({
    percent: 0,
    total: 0,
    delta: 0,
    transferred: 0,
    bytesPerSecond: 0
  });

  return { updateInfo };
});
