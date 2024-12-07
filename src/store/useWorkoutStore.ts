// src/store/useWorkoutStore.ts
import { defineStore } from 'pinia';
import api from '@/services/api';
import { Workout, Trainer } from '@/types';

export const useWorkoutStore = defineStore('workout', {
  state: () => ({
    workouts: [] as Workout[],
  }),
  actions: {
    async fetchWorkouts() {
      try {
        const [workoutsResponse, trainersResponse] = await Promise.all([
          api.get('/workouts'),
          api.get('/trainer-details/trainers'),
        ]);

        const trainers = trainersResponse.data as Trainer[];
        const workouts = workoutsResponse.data as Workout[];

        // Добавляем имя тренера в каждую тренировку
        this.workouts = workouts.map((workout) => {
          const trainer = trainers.find((t) => t.id === workout.trainerId);
          return {
            ...workout,
            trainerName: trainer ? trainer.name : 'Неизвестно',
          };
        });
      } catch (error) {
        console.error(error);
      }
    },
  },
});
