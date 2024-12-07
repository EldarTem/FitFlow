// src/store/useSubscriptionStore.ts
import { defineStore } from 'pinia';
import api from '@/services/api';
import { Subscription } from '@/types';

export const useSubscriptionStore = defineStore('subscription', {
  state: () => ({
    subscriptions: [] as Subscription[],
  }),
  actions: {
    async fetchSubscriptions() {
      try {
        const response = await api.get('/subscriptions');
        this.subscriptions = response.data;
      } catch (error) {
        console.error(error);
      }
    },
  },
});
