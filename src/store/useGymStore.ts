// src/store/useGymStore.ts
import { defineStore } from 'pinia';
import api from '@/services/api';
import { Gym } from '@/types';
import { ElNotification } from 'element-plus';
import { useUiStore } from './useUiStore';

interface GymState {
  gyms: Gym[];
}

export const useGymStore = defineStore('gym', {
  state: (): GymState => ({
    gyms: [],
  }),
  actions: {
    async fetchGyms() {
      const uiStore = useUiStore();
      uiStore.showLoader();
      try {
        const response = await api.get('/gyms');
        this.gyms = response.data;
      } catch (error: any) {
        ElNotification.error(
          error?.response?.data?.message || 'Не удалось загрузить список залов'
        );
      } finally {
        uiStore.hideLoader();
      }
    },
    async addGym(gym: Gym) {
      const uiStore = useUiStore();
      uiStore.showLoader();
      try {
        await api.post('/gyms', gym);
        ElNotification.success('Зал успешно добавлен');
        await this.fetchGyms();
      } catch (error: any) {
        ElNotification.error(
          error?.response?.data?.message || 'Не удалось добавить зал'
        );
      } finally {
        uiStore.hideLoader();
      }
    },
    async updateGym(gym: Gym) {
      const uiStore = useUiStore();
      uiStore.showLoader();
      try {
        await api.put(`/gyms/${gym.id}`, gym);
        ElNotification.success('Зал успешно обновлен');
        await this.fetchGyms();
      } catch (error: any) {
        ElNotification.error(
          error?.response?.data?.message || 'Не удалось обновить зал'
        );
      } finally {
        uiStore.hideLoader();
      }
    },
    async deleteGym(id: number) {
      const uiStore = useUiStore();
      uiStore.showLoader();
      try {
        await api.delete(`/gyms/${id}`);
        ElNotification.success('Зал успешно удален');
        await this.fetchGyms();
      } catch (error: any) {
        ElNotification.error(
          error?.response?.data?.message || 'Не удалось удалить зал'
        );
      } finally {
        uiStore.hideLoader();
      }
    },
  },
});
