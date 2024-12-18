<template>
  <div>
    <h2>Моё расписание</h2>

    <el-empty v-if="!workingHours.length" description="Расписание отсутствует">
    </el-empty>

    <el-table v-else :data="workingHours" style="width: 100%">
      <el-table-column prop="day_of_week" label="День недели" />
      <el-table-column
        :prop="'start_time'"
        label="Начало"
        :formatter="formatDisplayTime"
      />
      <el-table-column
        :prop="'end_time'"
        label="Конец"
        :formatter="formatDisplayTime"
      />
      <el-table-column label="Действия">
        <template #default="scope">
          <el-button
            size="small"
            icon="el-icon-edit"
            @click="editHour(scope.row)"
            >Изменить</el-button
          >
          <el-button
            size="small"
            type="danger"
            icon="el-icon-delete"
            @click="deleteWorkingHour(scope.row.id)"
            >Удалить</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-button type="primary" icon="el-icon-plus" @click="openForm">
      Добавить рабочее время
    </el-button>

    <el-dialog title="Рабочее время" v-model="showForm" @close="handleClose">
      <el-form :model="currentHour" ref="formRef" label-width="120px">
        <el-form-item label="День недели" required>
          <el-select
            v-model="currentHour.day_of_week"
            placeholder="Выберите день недели"
          >
            <el-option
              v-for="day in daysOfWeek"
              :key="day"
              :label="day"
              :value="day"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="Начало" required>
          <el-time-picker
            v-model="currentHour.start_time"
            format="HH:mm"
            value-format="HH:mm:ss"
            placeholder="Начало"
          />
        </el-form-item>

        <el-form-item label="Конец" required>
          <el-time-picker
            v-model="currentHour.end_time"
            format="HH:mm"
            value-format="HH:mm:ss"
            placeholder="Конец"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="handleClose">Отмена</el-button>
        <el-button type="primary" :loading="loading" @click="saveHour"
          >Сохранить</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted, computed } from "vue";
import { useTrainerScheduleStore } from "@/store/useTrainerScheduleStore";
import { useAuthStore } from "@/store/useAuthStore";
import type { WorkingHour } from "@/types";

export default defineComponent({
  name: "TrainerScheduleView",
  setup() {
    const scheduleStore = useTrainerScheduleStore();
    const authStore = useAuthStore();
    const {
      fetchWorkingHours,
      addWorkingHour,
      updateWorkingHour,
      deleteWorkingHour,
    } = scheduleStore;

    const workingHours = computed(() => scheduleStore.workingHours);

    const showForm = ref(false);
    const loading = ref(false);
    const formRef = ref();
    const currentHour = reactive<Partial<WorkingHour>>(getEmptyWorkingHour());

    const fetchWorking = async () => {
      await scheduleStore.fetchWorkingHours();
    };
    const daysOfWeek = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    function getEmptyWorkingHour(): Partial<WorkingHour> {
      return {
        trainer_id: authStore.user?.id || 0,
        day_of_week: "",
        start_time: "",
        end_time: "",
      };
    }
    const formatDisplayTime = (row: any, column: any, value: string) => {
      row;
      column;
      return value ? value.replace(/:\d{2}$/, "") : "";
    };
    const openForm = () => {
      Object.assign(currentHour, getEmptyWorkingHour());
      showForm.value = true;
    };

    const editHour = (hour: WorkingHour) => {
      Object.assign(currentHour, hour);
      showForm.value = true;
    };

    const saveHour = async () => {
      try {
        loading.value = true;
        currentHour.start_time = formatTime(currentHour.start_time);
        currentHour.end_time = formatTime(currentHour.end_time);
        if (currentHour.id) {
          await updateWorkingHour(currentHour as WorkingHour);
        } else {
          currentHour.trainer_id = authStore.user?.id || 0;
          await addWorkingHour(currentHour);
        }
        showForm.value = false;
        await fetchWorkingHours();
      } catch (error) {
        console.error("Ошибка при сохранении рабочего времени", error);
      } finally {
        loading.value = false;
      }
    };

    const handleClose = () => {
      (formRef.value as any)?.resetFields();
      showForm.value = false;
      Object.assign(currentHour, getEmptyWorkingHour());
    };

    function formatTime(time: string | Date | undefined): string {
      if (!time) return "";
      if (typeof time === "string" && time.includes(":")) return time;
      const date = new Date(time);
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const seconds = date.getSeconds().toString().padStart(2, "0");
      return `${hours}:${minutes}:${seconds}`;
    }

    onMounted(() => {
      fetchWorking();
    });

    return {
      workingHours,
      showForm,
      currentHour,
      daysOfWeek,
      openForm,
      saveHour,
      editHour,
      deleteWorkingHour,
      loading,
      formRef,
      handleClose,

      formatDisplayTime,
    };
  },
});
</script>

<style scoped>
.el-button {
  margin-right: 10px;
}
</style>
