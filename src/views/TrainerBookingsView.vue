<!-- src/views/TrainerBookingsView.vue -->
<template>
  <div class="trainer-bookings-page">
    <h2>Мои забронированные тренировки</h2>
    <el-row :gutter="20">
      <el-col
        v-for="c in bookedCards"
        :key="c.day_of_week + c.start_time + c.user_id"
        :span="8"
      >
        <el-card class="session-card">
          <h4>{{ c.day_of_week }}</h4>
          <p><strong>Время:</strong> {{ c.start_time }} - {{ c.end_time }}</p>
          <p><strong>Клиент:</strong> {{ c.user_id }}</p>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed } from "vue";
import { useTrainerWorkingHoursStore } from "@/store/useTrainerWorkingHoursStore";
import { useAuthStore } from "@/store/useAuthStore";

export default defineComponent({
  name: "TrainerBookingsView",
  setup() {
    const authStore = useAuthStore();
    const workingHoursStore = useTrainerWorkingHoursStore();

    const user = authStore.user;

    onMounted(async () => {
      if (user?.role === "trainer") {
        // Подгружаем рабочие часы тренера
        await workingHoursStore.getTrainerWorkingHours(user.id);
      }
    });

    // Формируем данные для карточек:
    // Берём каждую запись workingHours, фильтруем sessions со status='booked'
    // и создаём карточку с данными.
    const bookedCards = computed(() => {
      const cards: any[] = [];
      for (const wh of workingHoursStore.workingHours) {
        if (wh.sessions && Array.isArray(wh.sessions)) {
          const booked = wh.sessions.filter((s: any) => s.status === "booked");
          for (const s of booked) {
            cards.push({
              day_of_week: wh.day_of_week,
              start_time: wh.start_time,
              end_time: wh.end_time,
              user_id: s.user_id,
            });
          }
        }
      }
      return cards;
    });

    return {
      bookedCards,
      user,
    };
  },
});
</script>

<style scoped>
.trainer-bookings-page {
  padding: 20px;
}

.session-card {
  text-align: left;
}

.session-card h4 {
  margin-bottom: 10px;
}
</style>
