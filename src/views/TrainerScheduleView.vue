<template>
  <div>
    <h2>Моё расписание</h2>

    <el-empty v-if="!workingHours.length" description="Расписание отсутствует">
      <el-button type="primary" icon="el-icon-plus" @click="openForm">
        Добавить рабочее время
      </el-button>
    </el-empty>

    <el-table v-else :data="workingHours" style="width: 100%">
      <el-table-column prop="day_of_week" label="День недели" />
      <el-table-column prop="start_time" label="Начало" />
      <el-table-column prop="end_time" label="Конец" />
      <el-table-column label="Действия">
        <template #default="scope">
          <el-button
            size="small"
            icon="el-icon-edit"
            @click="editHour(scope.row)"
          >
            Изменить
          </el-button>
          <el-button
            size="small"
            type="danger"
            icon="el-icon-delete"
            @click="deleteHour(scope.row.id)"
          >
            Удалить
          </el-button>
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
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="Начало" required>
          <el-time-picker
            v-model="currentHour.start_time"
            format="HH:mm"
            placeholder="Начало"
            :picker-options="{ selectableRange: '00:00:00 - 23:59:59' }"
          />
        </el-form-item>

        <el-form-item label="Конец" required>
          <el-time-picker
            v-model="currentHour.end_time"
            format="HH:mm"
            placeholder="Конец"
            :picker-options="{ selectableRange: '00:00:00 - 23:59:59' }"
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
import { defineComponent, ref, reactive, onMounted } from "vue";
import { useTrainerScheduleStore } from "@/store/useTrainerScheduleStore";
import { WorkingHour } from "@/types";

export default defineComponent({
  name: "TrainerScheduleView",
  setup() {
    const scheduleStore = useTrainerScheduleStore();
    const {
      workingHours,
      fetchWorkingHours,
      addHour,
      updateHour,
      deleteHour,
    } = scheduleStore;

    const showForm = ref(false);
    const loading = ref(false);
    const formRef = ref();
    const currentHour = reactive<WorkingHour>(getEmptyWorkingHour());

    const daysOfWeek = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    function getEmptyWorkingHour(): WorkingHour {
      return {
        id: undefined,
        trainer_id: 0,
        day_of_week: "",
        start_time: "",
        end_time: "",
      };
    }

    const formatTime = (time: Date) => {
      const hours = String(time.getHours()).padStart(2, "0");
      const minutes = String(time.getMinutes()).padStart(2, "0");
      const seconds = "00";
      return `${hours}:${minutes}:${seconds}`;
    };

    const parseTime = (time: string) => {
      if (!time) return null;
      const [hours, minutes, seconds] = time.split(":").map(Number);
      const date = new Date();
      date.setHours(hours, minutes, seconds || 0);
      return date;
    };

    const openForm = () => {
      Object.assign(currentHour, getEmptyWorkingHour());
      showForm.value = true;
    };

    const editHour = (hour: WorkingHour) => {
      Object.assign(currentHour, {
        ...hour,
        start_time: parseTime(hour.start_time),
        end_time: parseTime(hour.end_time),
      });
      showForm.value = true;
    };

    const saveHour = async () => {
      try {
        loading.value = true;
        currentHour.start_time = formatTime(currentHour.start_time);
        currentHour.end_time = formatTime(currentHour.end_time);

        console.log("currentHour before saving:", currentHour);

        if (currentHour.id) {
          await updateHour(currentHour);
        } else {
          await addHour(currentHour);
        }
        showForm.value = false;
      } catch (error) {
        console.error("Ошибка при сохранении рабочего времени", error);
      } finally {
        loading.value = false;
      }
    };

    const handleClose = () => {
      formRef.value?.resetFields();
      showForm.value = false;
      Object.assign(currentHour, getEmptyWorkingHour());
    };

    onMounted(() => fetchWorkingHours());

    return {
      workingHours,
      showForm,
      currentHour,
      daysOfWeek,
      openForm,
      saveHour,
      editHour,
      deleteHour,
      loading,
      formRef,
      handleClose,
    };
  },
});
</script>

<style scoped>
.el-button {
  margin-right: 10px;
}
</style>
