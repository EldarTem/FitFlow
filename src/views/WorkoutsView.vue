<!-- src/views/WorkoutsView.vue -->
<template>
  <div class="workouts-view">
    <h2>Мои Тренировки</h2>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="Предстоящие" name="upcoming">
        <el-table :data="upcomingSessions" style="width: 100%">
          <el-table-column prop="specific_date" label="Дата" width="150" />
          <el-table-column prop="training_type" label="Тип тренировки" />
          <el-table-column prop="trainer_name" label="Тренер" />
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="Прошедшие" name="completed">
        <el-table :data="completedSessions" style="width: 100%">
          <el-table-column prop="specific_date" label="Дата" width="150" />
          <el-table-column prop="training_type" label="Тип тренировки" />
          <el-table-column prop="trainer_name" label="Тренер" />
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <div class="enroll-section">
      <el-button
        type="success"
        size="large"
        class="enroll-button"
        @click="showEnrollModal = true"
      >
        Записаться
      </el-button>
    </div>

    <el-dialog
      title="Записаться на тренировку"
      v-model="showEnrollModal"
      width="600px"
    >
      <el-form :model="enrollForm">
        <el-form-item label="Тренер" label-width="100px">
          <el-select
            v-model="enrollForm.trainer_id"
            placeholder="Выберите тренера"
            @change="fetchAvailableTimes"
          >
            <el-option
              v-for="t in trainers"
              :key="t.user_id"
              :label="t.name"
              :value="t.user_id"
            >
              <template #prefix>
                <div style="display: flex; align-items: center">
                  <div style="width: 30px; height: 30px; margin-right: 5px">
                    <img
                      v-if="t.photo_url"
                      :src="t.photo_url"
                      alt="Фото тренера"
                      style="width: 100%; height: 100%; border-radius: 50%"
                    />
                    <svg
                      v-else
                      version="1.0"
                      xmlns="http://www.w3.org/2000/svg"
                      width="100%"
                      height="100%"
                      viewBox="0 0 512 512"
                      preserveAspectRatio="xMidYMid meet"
                      opacity="0.3"
                    >
                      <g
                        transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                        fill="#000000"
                        stroke="none"
                      >
                        <path d="M2380 5114 ... (SVG PATH) ..." />
                      </g>
                    </svg>
                  </div>
                </div>
              </template>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="Время" label-width="100px">
          <el-select
            v-model="enrollForm.working_hour_id"
            placeholder="Выберите время"
          >
            <el-option
              v-for="slot in availableSlots"
              :key="slot.id"
              :label="formatSlot(slot)"
              :value="slot.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showEnrollModal = false">Отмена</el-button>
        <el-button type="primary" @click="enroll">Записаться</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed } from "vue";
import { useSessionStore } from "@/store/useSessionStore";
import { useTrainerStore } from "@/store/useTrainerStore";
import type { WorkingHour, TrainingSession, Trainer } from "@/types";

interface EnrollForm {
  trainer_id: number | null;
  working_hour_id: number | null;
}

export default defineComponent({
  name: "WorkoutsView",
  setup() {
    const sessionStore = useSessionStore();
    const trainerStore = useTrainerStore();

    // Активная вкладка: 'upcoming' или 'completed'
    const activeTab = ref<"upcoming" | "completed">("upcoming");

    // Модалка записи
    const showEnrollModal = ref(false);

    // Форма записи
    const enrollForm = ref<EnrollForm>({
      trainer_id: null,
      working_hour_id: null,
    });

    // Доступные временные слоты для выбранного тренера
    const availableSlots = ref<WorkingHour[]>([]);

    // Получаем предстоящие и завершенные сессии из стора
    const upcomingSessions = computed<TrainingSession[]>(
      () => sessionStore.upcomingSessions
    );
    const completedSessions = computed<TrainingSession[]>(
      () => sessionStore.completedSessions
    );
    const trainers = computed<Trainer[]>(() => trainerStore.trainers);

    onMounted(async () => {
      await sessionStore.fetchUpcomingSessions();
      await sessionStore.fetchCompletedSessions();
      await trainerStore.fetchAllTrainers();
    });

    const fetchAvailableTimes = async () => {
      if (enrollForm.value.trainer_id) {
        await sessionStore.fetchAvailableSessions(enrollForm.value.trainer_id);
        // Теперь availableSessions в sessionStore - это WorkingHour[]
        availableSlots.value = sessionStore.availableSessions;
      }
    };

    const enroll = async () => {
      if (enrollForm.value.working_hour_id) {
        await sessionStore.bookSession(enrollForm.value.working_hour_id);
        showEnrollModal.value = false;
        // Обновим предстоящие сессии после записи
        await sessionStore.fetchUpcomingSessions();
      }
    };

    const formatSlot = (slot: WorkingHour) => {
      return `${slot.specific_date || slot.day_of_week} ${slot.start_time}-${
        slot.end_time
      }`;
    };

    return {
      activeTab,
      upcomingSessions,
      completedSessions,
      showEnrollModal,
      enrollForm,
      trainers,
      availableSlots,
      fetchAvailableTimes,
      enroll,
      formatSlot,
    };
  },
});
</script>

<style scoped>
.workouts-view {
  padding: 20px;
}

.enroll-section {
  margin-top: 20px;
  text-align: center;
}

.enroll-button {
  font-size: 18px;
  padding: 10px 20px;
}
</style>
