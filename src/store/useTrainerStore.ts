// src/store/useTrainerStore.ts

import { defineStore } from 'pinia';
import api from '@/services/api';
import { TrainerDetails, TrainerStoreState } from '@/types';
import { ElNotification } from 'element-plus';

export const useTrainerStore = defineStore('trainer', {
  state: (): TrainerStoreState => ({
    trainerDetails: null,
  }),
  actions: {
    // Получение информации о тренере по user_id
    async fetchTrainerDetails(user_id: number): Promise<void> {
      try {
        const response = await api.get(`/trainer-details/${user_id}`);
        this.trainerDetails = response.data as TrainerDetails;
      } catch (error: any) {
        console.error(error);
        ElNotification({
          title: 'Ошибка получения данных тренера',
          message:
            error?.response?.data?.message ||
            'Не удалось загрузить данные тренера',
          type: 'error',
        });
      }
    },
    // Обновление информации о тренере по user_id
    async updateTrainerDetails(
      user_id: number,
      details: Partial<TrainerDetails>
    ): Promise<void> {
      try {
        await api.put(`/trainer-details/`, details);
        await this.fetchTrainerDetails(user_id); // Перезагружаем обновлённые данные
        ElNotification({
          title: 'Успешно',
          message: 'Информация о тренере успешно обновлена',
          type: 'success',
        });
      } catch (error: any) {
        console.error(error);
        ElNotification({
          title: 'Ошибка обновления данных тренера',
          message:
            error?.response?.data?.message ||
            'Не удалось обновить данные тренера',
          type: 'error',
        });
      }
    },
    // Создание информации о тренере
    async createTrainerDetails(
      details: Partial<TrainerDetails>
    ): Promise<void> {
      try {
        const response = await api.post('/trainer-details', details);
        this.trainerDetails = response.data.trainer as TrainerDetails;
        ElNotification({
          title: 'Успешно',
          message: 'Информация о тренере успешно добавлена',
          type: 'success',
        });
      } catch (error: any) {
        console.error(error);
        ElNotification({
          title: 'Ошибка создания данных тренера',
          message:
            error?.response?.data?.message ||
            'Не удалось создать данные тренера',
          type: 'error',
        });
      }
    },
    // Удаление информации о тренере по user_id
    async deleteTrainerDetails(user_id: number): Promise<void> {
      try {
        await api.delete(`/trainer-details/${user_id}`);
        this.trainerDetails = null;
        ElNotification({
          title: 'Успешно',
          message: 'Информация о тренере успешно удалена',
          type: 'success',
        });
      } catch (error: any) {
        console.error(error);
        ElNotification({
          title: 'Ошибка удаления данных тренера',
          message:
            error?.response?.data?.message ||
            'Не удалось удалить данные тренера',
          type: 'error',
        });
      }
    },
  },
});
