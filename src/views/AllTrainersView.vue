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
          @view-schedule="viewSchedule"
        />
      </el-col>
    </el-row>

    <el-dialog title="Добавить/Изменить тренера" v-model="showForm">
      <el-form :model="currentTrainer" label-width="120px">
        <el-form-item label="Имя" required>
          <el-input v-model="currentTrainer.name" />
        </el-form-item>
        <el-form-item label="Email" required>
          <el-input v-model="currentTrainer.email" />
        </el-form-item>
        <el-form-item label="Телефон">
          <el-input
            v-model="currentTrainer.phone"
            @input="
              currentTrainer.phone = formatPhone(currentTrainer.phone || '')
            "
          />
        </el-form-item>
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
        <el-form-item
          label="User ID для повышения в тренера"
          required
          v-if="!currentTrainer.user_id"
        >
          <el-input
            v-model="promoteUserId"
            type="number"
            placeholder="ID пользователя"
          />
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
import { Trainer, WorkingHour } from "@/types";
import { useTrainerDetailsStore } from "@/store/useTrainerDetailsStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useUiStore } from "@/store/useUiStore";
import TrainerCard from "@/components/TrainerCard.vue";
import api from "@/services/api";
import { ElNotification } from "element-plus";

function formatPhone(value: string): string {
  let digits = value.replace(/\D/g, "");
  if (!digits.startsWith("7")) {
    digits = "7" + digits;
  }
  let formatted = "+7";
  if (digits.length > 1) {
    formatted += " (" + digits.substring(1, 4);
  }
  if (digits.length >= 5) {
    formatted += ") " + digits.substring(4, 7);
  }
  if (digits.length >= 8) {
    formatted += "-" + digits.substring(7, 9);
  }
  if (digits.length >= 10) {
    formatted += "-" + digits.substring(9, 11);
  }
  return formatted;
}

function isValidEmail(email: string): boolean {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}

export default defineComponent({
  name: "AllTrainersView",
  components: {
    TrainerCard,
  },
  setup() {
    const trainerDetailsStore = useTrainerDetailsStore();
    const authStore = useAuthStore();
    const uiStore = useUiStore();

    const showForm = ref(false);

    const currentTrainer = ref<Partial<Trainer>>({
      name: "",
      email: "",
      phone: "",
      specialization: "",
      experience_years: 0,
      bio: "",
      certifications: "",
      photo_url: "",
      role: "trainer",
    });

    const promoteUserId = ref<number | null>(null);
    const schedule = ref<WorkingHour[]>([]);
    const showScheduleDialog = ref(false);

    const trainers = computed(() => trainerDetailsStore.trainers);

    const fetchTrainers = async () => {
      await trainerDetailsStore.fetchAllTrainers();
    };

    const openAddForm = () => {
      currentTrainer.value = {
        name: "",
        email: "",
        phone: "",
        specialization: "",
        experience_years: 0,
        bio: "",
        certifications: "",
        photo_url: "",
        role: "trainer",
      };
      promoteUserId.value = null;
      showForm.value = true;
    };

    const editTrainer = (t: Trainer) => {
      currentTrainer.value = { ...t };
      promoteUserId.value = null;
      showForm.value = true;
    };

    const saveTrainer = async () => {
      if (!isValidEmail(currentTrainer.value.email || "")) {
        ElNotification.error("Некорректный email");
        return;
      }

      if (!currentTrainer.value.user_id && promoteUserId.value) {
        await authStore.assignRoleToUser(promoteUserId.value, "trainer");
        await trainerDetailsStore.addTrainerDetails(currentTrainer.value);
      } else if (currentTrainer.value.user_id) {
        await trainerDetailsStore.updateTrainerDetails(currentTrainer.value);
      } else {
        ElNotification.error(
          "Не указан ID пользователя для повышения в тренера"
        );
      }

      showForm.value = false;
    };

    const deleteTrainer = async (user_id: number) => {
      await trainerDetailsStore.deleteTrainerDetailsById(user_id);
    };

    const viewSchedule = async (user_id: number) => {
      uiStore.showLoader();
      try {
        const response = await api.get(`/trainer-working-hours/${user_id}`);
        schedule.value = response.data.map((wh: any) => ({
          id: wh.working_hour_id,
          trainer_id: wh.trainer_id,
          day_of_week: wh.day_of_week,
          specific_date: wh.specific_date,
          start_time: wh.start_time,
          end_time: wh.end_time,
          status: wh.working_hour_status,
        })) as WorkingHour[];
        showScheduleDialog.value = true;
      } catch (error: any) {
        ElNotification.error("Не удалось загрузить расписание тренера");
      } finally {
        uiStore.hideLoader();
      }
    };

    onMounted(() => {
      fetchTrainers();
    });

    return {
      trainers,
      showForm,
      currentTrainer,
      promoteUserId,
      openAddForm,
      editTrainer,
      deleteTrainer,
      saveTrainer,
      viewSchedule,
      schedule,
      showScheduleDialog,
      uiStore,
      formatPhone,
      isValidEmail,
    };
  },
});
</script>

<style scoped>
.trainers-page {
  padding: 20px;
}
</style>
