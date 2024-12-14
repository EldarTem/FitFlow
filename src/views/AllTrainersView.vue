<template>
  <div class="trainers-page">
    <h2>Управление тренерами</h2>
    <el-button type="primary" @click="openAddForm" style="margin-bottom: 20px"
      >Добавить тренера</el-button
    >

    <el-row :gutter="20">
      <el-col :span="8" v-for="t in trainers" :key="t.user_id">
        <TrainerCard
          :trainer="t"
          @edit-trainer="editTrainer"
          @delete-trainer="deleteTrainer"
          @view-schedule="() => viewSchedule(t.user_id ?? 0)"
        />
      </el-col>
    </el-row>

    <el-dialog title="Добавить тренера" v-model="showForm" v-if="!isEditMode">
      <el-form :model="promoteTrainer" label-width="120px">
        <el-form-item label="Email для повышения" required>
          <el-input v-model="promoteTrainer.email" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showForm = false">Отмена</el-button>
        <el-button type="primary" @click="saveTrainer">Сохранить</el-button>
      </template>
    </el-dialog>

    <el-dialog
      title="Редактировать тренера"
      v-model="showForm"
      v-if="isEditMode"
    >
      <el-form :model="currentTrainer" label-width="120px">
        <el-form-item label="Специализация">
          <el-input v-model="currentTrainer.specialization" />
        </el-form-item>
        <el-form-item label="Опыт">
          <el-input type="number" v-model="currentTrainer.experience_years" />
        </el-form-item>
        <el-form-item label="Биография">
          <el-input v-model="currentTrainer.bio" type="textarea" />
        </el-form-item>
        <el-form-item label="Сертификаты">
          <el-input v-model="currentTrainer.certifications" />
        </el-form-item>
        <el-form-item label="Фото URL">
          <el-input v-model="currentTrainer.photo_url" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showForm = false">Отмена</el-button>
        <el-button type="primary" @click="saveTrainer">Сохранить</el-button>
      </template>
    </el-dialog>

    <el-dialog
      title="График тренера"
      v-model="showScheduleDialog"
      width="600px"
    >
      <el-table :data="schedule" style="width: 100%">
        <el-table-column prop="day_of_week" label="День недели" />
        <el-table-column prop="start_time" label="Начало" />
        <el-table-column prop="end_time" label="Конец" />
        <el-table-column prop="status" label="Статус" />
      </el-table>
      <template #footer>
        <el-button @click="showScheduleDialog = false">Закрыть</el-button>
      </template>
    </el-dialog>

    <Loader :loading="uiStore.isLoading" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import { useTrainerDetailsStore } from "@/store/useTrainerDetailsStore";
import { useTrainerWorkingHoursStore } from "@/store/useTrainerWorkingHoursStore";
import { useUiStore } from "@/store/useUiStore";
import { useAuthStore } from "@/store/useAuthStore";
import TrainerCard from "@/components/TrainerCard.vue";
import type { Trainer } from "@/types";

export default defineComponent({
  name: "AllTrainersView",
  components: { TrainerCard },
  setup() {
    const trainerDetailsStore = useTrainerDetailsStore();
    const trainerWorkingHoursStore = useTrainerWorkingHoursStore();
    const uiStore = useUiStore();
    const authStore = useAuthStore();

    const showForm = ref(false);
    const isEditMode = ref(false);
    const promoteTrainer = ref<{ email: string }>({ email: "" });
    const currentTrainer = ref<Partial<Trainer>>({
      specialization: "",
      experience_years: 0,
      bio: "",
      certifications: "",
      photo_url: "",
      role: "trainer",
    });

    const schedule = ref<any[]>([]);
    const showScheduleDialog = ref(false);
    const trainers = computed(() => trainerDetailsStore.trainers);

    const fetchTrainers = async () => {
      await trainerDetailsStore.fetchAllTrainers();
    };

    const openAddForm = () => {
      isEditMode.value = false;
      promoteTrainer.value = { email: "" };
      showForm.value = true;
    };

    const editTrainer = (t: Trainer) => {
      isEditMode.value = true;
      currentTrainer.value = { ...t };
      showForm.value = true;
    };

    const saveTrainer = async () => {
      if (!isEditMode.value) {
        await authStore.assignRoleToUser(promoteTrainer.value.email, "trainer");
        await trainerDetailsStore.addTrainerDetails(currentTrainer.value);
      } else {
        await trainerDetailsStore.updateTrainerDetails(currentTrainer.value);
      }
      showForm.value = false;
    };

    const deleteTrainer = async () => {
      await trainerDetailsStore.deleteTrainerDetails();
    };

    const viewSchedule = async (trainerId: number) => {
      try {
        await trainerWorkingHoursStore.getTrainerWorkingHours(trainerId);
        schedule.value = trainerWorkingHoursStore.workingHours;
        showScheduleDialog.value = true;
      } catch (error) {
        console.error("Ошибка при получении графика тренера", error);
      }
    };

    onMounted(() => {
      fetchTrainers();
    });

    return {
      trainers,
      showForm,
      isEditMode,
      promoteTrainer,
      currentTrainer,
      openAddForm,
      editTrainer,
      deleteTrainer,
      saveTrainer,
      viewSchedule,
      schedule,
      showScheduleDialog,
      uiStore,
    };
  },
});
</script>

<style scoped>
.trainers-page {
  padding: 20px;
}
</style>
