import { defineStore } from 'pinia';
import api from '@/services/api';
import { ElNotification } from 'element-plus';
import { WorkingHour } from '@/types';

export const useTrainerScheduleStore = defineStore('trainerSchedule', {
  state: () => ({
    workingHours: [] as WorkingHour[],
  }),
  actions: {
    async fetchWorkingHours() {
      try {
        const response = await api.get('/trainer-schedule');
        this.workingHours = response.data;
      } catch (error) {
        ElNotification.error('Ошибка загрузки расписания');
      }
    },

    async addHour(hour: WorkingHour) {
      try {
        const response = await api.post('/trainer-schedule', hour);
        this.workingHours.push(response.data);
        ElNotification.success('Рабочее время добавлено');
      } catch (error) {
        ElNotification.error('Ошибка добавления рабочего времени');
      }
    },

    async updateHour(hour: WorkingHour) {
      try {
        await api.put(`/trainer-schedule/${hour.id}`, hour);
        await this.fetchWorkingHours();
        ElNotification.success('Рабочее время обновлено');
      } catch (error) {
        ElNotification.error('Ошибка обновления рабочего времени');
      }
    },

    async deleteHour(id: number) {
      try {
        await api.delete(`/trainer-schedule/${id}`);
        this.workingHours = this.workingHours.filter((hour) => hour.id !== id);
        ElNotification.success('Рабочее время удалено');
      } catch (error) {
        ElNotification.error('Ошибка удаления рабочего времени');
      }
    },
  },
});
