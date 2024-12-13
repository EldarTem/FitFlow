// src/store/useTrainerWorkingHoursStore.ts
import { defineStore } from 'pinia';
import api from '@/services/api';
import { WorkingHour } from '@/types';
import { ElNotification } from 'element-plus';
import { useUiStore } from './useUiStore';

export const useTrainerWorkingHoursStore = defineStore('trainerWorkingHours', {
  state: () => ({
    workingHours: [] as WorkingHour[],
  }),
  actions: {
    async createWorkingHour(hour: Partial<WorkingHour>) {
      const uiStore = useUiStore();
      uiStore.showLoader();
      try {
        await api.post('/trainer-working-hours', hour);
        ElNotification.success('Рабочий час успешно создан');
      } catch (error) {
        ElNotification.error('Ошибка при создании рабочего часа');
      } finally {
        uiStore.hideLoader();
      }
    },
    async getTrainerWorkingHours(trainer_id: number) {
      const uiStore = useUiStore();
      uiStore.showLoader();
      try {
        const response = await api.get(`/trainer-working-hours/${trainer_id}`);
        this.workingHours = response.data;
      } catch (error) {
        ElNotification.error('Ошибка при получении рабочих часов тренера');
      } finally {
        uiStore.hideLoader();
      }
    },
    async updateWorkingHour(hour: WorkingHour) {
      const uiStore = useUiStore();
      uiStore.showLoader();
      try {
        await api.put(`/trainer-working-hours/${hour.id}`, hour);
        ElNotification.success('Рабочий час успешно обновлён');
      } catch (error) {
        ElNotification.error('Ошибка при обновлении рабочего часа');
      } finally {
        uiStore.hideLoader();
      }
    },
    async deleteWorkingHour(id: number) {
      const uiStore = useUiStore();
      uiStore.showLoader();
      try {
        await api.delete(`/trainer-working-hours/${id}`);
        ElNotification.success('Рабочий час успешно удалён');
        this.workingHours = this.workingHours.filter((h) => h.id !== id);
      } catch (error) {
        ElNotification.error('Ошибка при удалении рабочего часа');
      } finally {
        uiStore.hideLoader();
      }
    },
  },
});
