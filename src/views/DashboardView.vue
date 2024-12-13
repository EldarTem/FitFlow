<template>
  <div class="dashboard">
    <h1>Добро пожаловать, {{ user?.name }}!</h1>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card>
          <h3>Ваша информация</h3>
          <p><strong>Email:</strong> {{ user?.email }}</p>
          <p><strong>Телефон:</strong> {{ user?.phone }}</p>
          <p><strong>Роль:</strong> {{ user?.role }}</p>
          <el-button type="primary" @click="goToProfile"
            >Перейти в профиль</el-button
          >
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <h3>Предстоящие тренировки</h3>
          <el-table :data="upcomingSessions" style="width: 100%">
            <el-table-column prop="specific_date" label="Дата" width="150" />
            <el-table-column prop="training_type" label="Тип тренировки" />
            <el-table-column prop="trainer_name" label="Тренер" />
          </el-table>
          <el-button type="primary" @click="goToWorkouts"
            >Все тренировки</el-button
          >
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <h3>Быстрые ссылки</h3>
          <el-button type="primary" @click="goToWorkouts" v-if="isUserOrTrainer"
            >Тренировки</el-button
          >
          <el-button type="primary" @click="goToProgress" v-if="isUserOrTrainer"
            >Прогресс</el-button
          >
          <el-button type="primary" @click="goToSubscription" v-if="isUser"
            >Абонемент</el-button
          >
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed } from "vue";
import { useAuthStore } from "@/store/useAuthStore";
import { useTrainingSessionsStore } from "@/store/useTrainingSessionsStore";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "DashboardView",
  setup() {
    const authStore = useAuthStore();
    const sessionStore = useTrainingSessionsStore();
    const router = useRouter();

    const user = authStore.user;
    const upcomingSessions = computed(() => sessionStore.upcomingSessions);

    onMounted(async () => {
      await sessionStore.fetchUserSessions();
    });

    const isUserOrTrainer = computed(
      () => user && (user.role === "user" || user.role === "trainer")
    );
    const isUser = computed(() => user?.role === "user");

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
      isUserOrTrainer,
      isUser,
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
