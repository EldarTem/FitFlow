<!-- src/views/DashboardView.vue -->
<template>
  <div class="dashboard">
    <h1>Добро пожаловать, {{ user.name }}!</h1>
    <el-row :gutter="20">
      <!-- Блок информации о пользователе -->
      <el-col :span="8">
        <el-card>
          <h3>Ваша информация</h3>
          <p><strong>Email:</strong> {{ user.email }}</p>
          <p><strong>Телефон:</strong> {{ user.phone }}</p>
          <p><strong>Роль:</strong> {{ user.role }}</p>
          <el-button type="primary" @click="goToProfile"
            >Перейти в профиль</el-button
          >
        </el-card>
      </el-col>

      <!-- Блок предстоящих тренировок -->
      <el-col :span="8">
        <el-card>
          <h3>Предстоящие тренировки</h3>
          <el-table :data="upcomingSessions" style="width: 100%">
            <el-table-column prop="date" label="Дата" width="150" />
            <el-table-column prop="training_type" label="Тип тренировки" />
            <el-table-column prop="trainer_name" label="Тренер" />
          </el-table>
          <el-button type="primary" @click="goToWorkouts"
            >Все тренировки</el-button
          >
        </el-card>
      </el-col>

      <!-- Блок быстрых ссылок -->
      <el-col :span="8">
        <el-card>
          <h3>Быстрые ссылки</h3>
          <el-button type="primary" @click="goToWorkouts">Тренировки</el-button>
          <el-button type="primary" @click="goToProgress">Прогресс</el-button>
          <el-button type="primary" @click="goToSubscription"
            >Абонемент</el-button
          >
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { useAuthStore } from "@/store/useAuthStore";
import { useSessionStore } from "@/store/useSessionStore";

import { useRouter } from "vue-router";
import { TrainingSession } from "@/types";

export default defineComponent({
  name: "DashboardView",
  setup() {
    const authStore = useAuthStore();
    const sessionStore = useSessionStore();
    const router = useRouter();

    const user = authStore.user!;
    const upcomingSessions = ref<TrainingSession[]>([]);

    onMounted(async () => {
      await sessionStore.fetchUpcomingSessions();
      upcomingSessions.value = sessionStore.upcomingSessions;
    });

    const goToProfile = () => {
      router.push("/dashboard/profile");
    };

    const goToWorkouts = () => {
      router.push("/dashboard/workouts");
    };

    const goToProgress = () => {
      router.push("/dashboard/progress");
    };

    const goToSubscription = () => {
      router.push("/dashboard/subscription");
    };

    return {
      user,
      upcomingSessions,
      goToProfile,
      goToWorkouts,
      goToProgress,
      goToSubscription,
    };
  },
});
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.dashboard h1 {
  margin-bottom: 20px;
}
</style>
