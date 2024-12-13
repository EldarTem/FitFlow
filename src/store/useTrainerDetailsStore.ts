// src/store/useTrainerDetailsStore.ts
import { defineStore } from 'pinia';
import api from '@/services/api';
import { Trainer } from '@/types';
import { ElNotification } from 'element-plus';
import { useUiStore } from './useUiStore';

interface TrainerDetailsState {
  trainers: Trainer[];
}

export const useTrainerDetailsStore = defineStore('trainerDetails', {
  state: (): TrainerDetailsState => ({
    trainers: [],
  }),
  actions: {
    async fetchAllTrainers() {
      const uiStore = useUiStore();
      uiStore.showLoader();
      try {
        const response = await api.get('/trainer-details/trainers');
        this.trainers = response.data;
      } catch (error: any) {
        ElNotification.error(
          error?.response?.data?.message ||
            'Не удалось загрузить список тренеров'
        );
      } finally {
        uiStore.hideLoader();
      }
    },
    async addTrainerDetails(details: Partial<Trainer>) {
      const uiStore = useUiStore();
      uiStore.showLoader();
      try {
        await api.post('/trainer-details', details);
        ElNotification.success('Информация о тренере добавлена');
        await this.fetchAllTrainers();
      } catch (error: any) {
        ElNotification.error(
          error?.response?.data?.message || 'Не удалось добавить тренера'
        );
      } finally {
        uiStore.hideLoader();
      }
    },
    async updateTrainerDetails(details: Partial<Trainer>) {
      const uiStore = useUiStore();
      uiStore.showLoader();
      try {
        await api.put('/trainer-details', details);
        ElNotification.success('Информация о тренере обновлена');
        await this.fetchAllTrainers();
      } catch (error: any) {
        ElNotification.error(
          error?.response?.data?.message || 'Не удалось обновить данные тренера'
        );
      } finally {
        uiStore.hideLoader();
      }
    },
    async deleteTrainerDetailsById(user_id: number) {
      const uiStore = useUiStore();
      uiStore.showLoader();
      try {
        await api.delete(`/trainer-details/byid/${user_id}`);
        ElNotification.success('Тренер удален');
        await this.fetchAllTrainers();
      } catch (error: any) {
        ElNotification.error(
          error?.response?.data?.message || 'Не удалось удалить тренера'
        );
      } finally {
        uiStore.hideLoader();
      }
    },
  },
});
