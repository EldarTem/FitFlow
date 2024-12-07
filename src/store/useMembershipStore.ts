// src/store/useMembershipStore.ts

import { defineStore } from 'pinia';
import api from '@/services/api';
import { MembershipStoreState, Membership } from '@/types';

export const useMembershipStore = defineStore('membership', {
  state: (): MembershipStoreState => ({
    membership: null,
  }),
  actions: {
    async fetchMembership() {
      try {
        const response = await api.get('/memberships/current');
        this.membership = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    async purchaseMembership(membershipData: Partial<Membership>) {
      try {
        const response = await api.post('/memberships', membershipData);
        this.membership = response.data.membership;
      } catch (error) {
        console.error(error);
      }
    },
  },
});
