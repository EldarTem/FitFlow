<!-- src/components/WorkoutCard.vue -->
<template>
  <el-card>
    <h3>{{ workout.name }}</h3>
    <p>{{ workout.description }}</p>
    <p>Тренер: {{ workout.trainerName }}</p>
    <el-button type="primary" @click="enroll">Записаться</el-button>
  </el-card>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { Workout } from "@/types";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/services/api";

export default defineComponent({
  name: "WorkoutCard",
  props: {
    workout: {
      type: Object as PropType<Workout>,
      required: true,
    },
  },
  setup(props) {
    const authStore = useAuthStore();

    const enroll = async () => {
      if (!authStore.user) return;
      try {
        await api.post("/enrollments", {
          userId: authStore.user.id,
          workoutId: props.workout.id,
        });
        // Уведомление об успешной записи
      } catch (error) {
        console.error(error);
      }
    };

    return {
      enroll,
    };
  },
});
</script>
