import { defineStore } from 'pinia';
import { ref } from 'vue';
export const useMainMessageStore = defineStore('mainmessage', () => {
  const message = ref('');
  return { message };
});
