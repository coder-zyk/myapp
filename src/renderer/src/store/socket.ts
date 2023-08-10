import { defineStore } from 'pinia';
import { ref } from 'vue';
export const useSocketStore = defineStore('socket', () => {
  const messageData = ref();

  return { messageData };
});
