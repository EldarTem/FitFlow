// src/store/useSessionStore.ts

import { defineStore } from 'pinia';
import api from '@/services/api';
import { SessionStoreState } from '@/types';

export const useSessionStore = defineStore('session', {
  state: (): SessionStoreState => ({
    upcomingSessions: [],
    availableSessions: [],
    completedSessions: [],
  }),
  actions: {
    async fetchUpcomingSessions() {
      try {
        const response = await api.get('/training-sessions/upcoming');
        this.upcomingSessions = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    async fetchAvailableSessions() {
      try {
        const response = await api.get('/training-sessions/available');
        this.availableSessions = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    async fetchCompletedSessions() {
      try {
        const response = await api.get('/training-sessions/completed');
        this.completedSessions = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    async bookSession(sessionId: number) {
      try {
        await api.post(`/booked-sessions`, { session_id: sessionId });
        // Обновляем список предстоящих тренировок
        await this.fetchUpcomingSessions();
      } catch (error) {
        console.error(error);
      }
    },
  },
});
