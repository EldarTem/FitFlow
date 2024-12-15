<!-- src/components/ClientDashboard.vue -->
<template>
  <div class="client-dashboard">
    <section class="welcome-section">
      <h1>Добро пожаловать, {{ user.name }}!</h1>
      <p v-if="user.goals">Ваши цели: {{ user.goals }}</p>
      <p v-else>Установите свои цели в профиле.</p>
    </section>

    <section class="upcoming-trainings">
      <h2>Предстоящие Тренировки</h2>
      <el-table :data="upcomingSessions" style="width: 100%">
        <el-table-column prop="day_of_week" label="День недели" />
        <el-table-column prop="start_time" label="Начало" />
        <el-table-column prop="end_time" label="Конец" />
        <el-table-column prop="trainer_name" label="Тренер" />
      </el-table>
      <el-button type="primary" @click="openEnrollModal" class="enroll-button">
        Записаться на новую тренировку
      </el-button>
    </section>

    <section class="training-history">
      <h2>История Тренировок</h2>
      <el-table :data="completedSessions" style="width: 100%">
        <el-table-column prop="day_of_week" label="День недели" />
        <el-table-column prop="start_time" label="Начало" />
        <el-table-column prop="end_time" label="Конец" />
        <el-table-column prop="trainer_name" label="Тренер" />
      </el-table>
    </section>

    <section class="progress-section">
      <h2>Ваш Прогресс</h2>
      <el-card>
        <!-- Заглушка для графика прогресса -->
        <p>График прогресса будет доступен позже.</p>
      </el-card>
    </section>

    <!-- Модальное окно записи на тренировку -->
    <el-dialog
      title="Записаться на тренировку"
      v-model="showEnrollModal"
      width="800px"
    >
      <div class="trainers-list" v-if="trainers.length">
        <h3>Выберите тренера</h3>
        <el-row :gutter="20">
          <el-col v-for="t in trainers" :key="t.id" :span="8">
            <el-card class="trainer-card" @click="selectTrainer(t)">
              <div class="trainer-photo-container">
                <img
                  v-if="t.photo_url"
                  :src="t.photo_url"
                  alt="Фото тренера"
                  class="trainer-photo"
                  @error="handleImageError(t)"
                />
                <el-avatar
                  v-else
                  icon="UserFilled"
                  class="trainer-avatar"
                ></el-avatar>
              </div>
              <h4>{{ t.name }}</h4>
              <p>{{ t.specialization }}</p>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <div v-if="enrollForm.trainer_id && availableSlots.length">
        <h3>Доступные Тренировки</h3>
        <el-table :data="availableSlots" style="width: 100%">
          <el-table-column prop="day_of_week" label="День недели" />
          <el-table-column prop="start_time" label="Начало" />
          <el-table-column prop="end_time" label="Конец" />
          <el-table-column label="Действия">
            <template #default="scope">
              <el-button
                type="success"
                size="small"
                @click="enroll(scope.row.id)"
              >
                Записаться
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-else-if="enrollForm.trainer_id && !availableSlots.length">
        <p>У выбранного тренера нет доступных слотов.</p>
      </div>

      <template #footer>
        <el-button @click="showEnrollModal = false">Закрыть</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed } from "vue";
import type { TrainingSession, Trainer, WorkingHour, User } from "@/types";
import { ElNotification } from "element-plus";
import { UserFilled } from "@element-plus/icons-vue";

interface EnrollForm {
  trainer_id: number | null;
}

export default defineComponent({
  name: "ClientDashboard",
  components: { UserFilled },
  setup() {
    // Заглушка: Пользователь
    const user = ref<User>({
      id: 1,
      name: "Иван Иванов",
      email: "ivan@example.com",
      role: "user",
      goals: "Набор мышечной массы",
    });

    // Заглушка: Предстоящие тренировки
    const upcomingSessions = ref<TrainingSession[]>([
      {
        id: 1,
        day_of_week: "Понедельник",
        start_time: "10:00",
        end_time: "11:00",
        trainer_name: "Петр Петров",
        status: "confirmed",
      },
      {
        id: 2,
        day_of_week: "Среда",
        start_time: "14:00",
        end_time: "15:00",
        trainer_name: "Сергей Сергеев",
        status: "pending",
      },
    ]);

    // Заглушка: Завершённые тренировки
    const completedSessions = ref<TrainingSession[]>([
      {
        id: 3,
        day_of_week: "Пятница",
        start_time: "09:00",
        end_time: "10:00",
        trainer_name: "Петр Петров",
        status: "completed",
      },
    ]);

    // Заглушка: Тренеры
    const trainers = ref<Trainer[]>([
      {
        id: 1,
        name: "Петр Петров",
        email: "petr@example.com",
        phone: "+7 123 456-78-90",
        role: "trainer",
        specialization: "Бодибилдинг",
        experience_years: 5,
        bio: "Петр - опытный тренер по бодибилдингу.",
        certifications: "NASM, IFBB",
        photo_url: "",
      },
      {
        id: 2,
        name: "Сергей Сергеев",
        email: "sergey@example.com",
        phone: "+7 987 654-32-10",
        role: "trainer",
        specialization: "Функциональный тренинг",
        experience_years: 3,
        bio: "Сергей специализируется на функциональном тренинге.",
        certifications: "CrossFit Level 1",
        photo_url: "",
      },
    ]);

    // Заглушка: Доступные слоты
    const availableSlots = ref<WorkingHour[]>([
      {
        id: 1,
        trainer_id: 1,
        day_of_week: "Понедельник",
        start_time: "10:00",
        end_time: "11:00",
        status: "available",
      },
      {
        id: 2,
        trainer_id: 1,
        day_of_week: "Среда",
        start_time: "14:00",
        end_time: "15:00",
        status: "available",
      },
    ]);

    // Модальное окно
    const showEnrollModal = ref(false);

    const enrollForm = ref<EnrollForm>({
      trainer_id: null,
    });

    const openEnrollModal = () => {
      enrollForm.value.trainer_id = null;
      availableSlots.value = [];
      showEnrollModal.value = true;
    };

    const selectTrainer = (trainer: Trainer) => {
      enrollForm.value.trainer_id = trainer.id;
      // Заглушка: Фильтрация доступных слотов по тренеру
      availableSlots.value = availableSlots.value.filter(
        (slot) => slot.trainer_id === trainer.id && slot.status === "available"
      );
    };

    const enroll = async (working_hour_id: number) => {
      if (!working_hour_id) {
        ElNotification.error("Выберите время для тренировки");
        return;
      }
      try {
        // Заглушка: Бронирование тренировки
        const slot = availableSlots.value.find((s) => s.id === working_hour_id);
        if (slot) {
          slot.status = "booked";
          ElNotification.success("Вы успешно записались на тренировку");
          showEnrollModal.value = false;
        } else {
          throw new Error("Слот не найден");
        }
      } catch (error: any) {
        ElNotification.error(
          error?.response?.data?.message ||
            "Не удалось записаться на тренировку"
        );
      }
    };

    const handleImageError = (trainer: Trainer) => {
      trainer.photo_url = "";
    };

    return {
      user,
      upcomingSessions,
      completedSessions,
      trainers,
      availableSlots,
      showEnrollModal,
      enrollForm,
      openEnrollModal,
      selectTrainer,
      enroll,
      handleImageError,
    };
  },
});
</script>

<style scoped>
.client-dashboard {
  padding: 20px;
}

.welcome-section {
  margin-bottom: 20px;
}

.upcoming-trainings,
.training-history,
.progress-section {
  margin-bottom: 30px;
}

.enroll-button {
  margin-top: 10px;
}

.trainers-list {
  margin-bottom: 20px;
}

.trainer-card {
  cursor: pointer;
  text-align: center;
  padding: 10px;
}

.trainer-photo-container {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}

.trainer-photo {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}

.trainer-avatar {
  width: 100px;
  height: 100px;
  font-size: 50px;
  background-color: #e5e5e5;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
