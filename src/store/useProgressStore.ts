// src/store/useProgressStore.ts
import { defineStore } from 'pinia';
import api from '@/services/api';
import { useAuthStore } from './useAuthStore';
import { ProgressEntry } from '@/types';

export const useProgressStore = defineStore('progress', {
  state: () => ({
    progressData: [] as ProgressEntry[],
  }),
  actions: {
    async fetchProgress() {
      const authStore = useAuthStore();
      if (!authStore.user) return;
      try {
        const response = await api.get('/progress', {
          params: { userId: authStore.user.id },
        });
        this.progressData = response.data;
      } catch (error) {
        console.error(error);
      }
    },
  },
});
