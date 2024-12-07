<!-- src/views/GymTrainersView.vue -->
<template>
  <div>
    <h2>Тренеры вашего зала</h2>
    <el-table :data="trainers" style="width: 100%">
      <el-table-column prop="name" label="Имя" />
      <el-table-column prop="specialization" label="Специализация" />
      <el-table-column label="Действия">
        <template #default="scope">
          <el-button @click="editTrainer(scope.row)">Изменить</el-button>
          <el-button type="danger" @click="removeTrainer(scope.row.id)"
            >Удалить</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-button type="primary" @click="showAddForm = true"
      >Добавить тренера</el-button
    >

    <el-dialog title="Добавить/Изменить тренера" :visible.sync="showAddForm">
      <el-form :model="currentTrainer">
        <el-form-item label="Имя">
          <el-input v-model="currentTrainer.name"></el-input>
        </el-form-item>
        <el-form-item label="Специализация">
          <el-input v-model="currentTrainer.specialization"></el-input>
        </el-form-item>
        <!-- Остальные поля тренера -->
      </el-form>
      <span slot="footer">
        <el-button @click="showAddForm = false">Отмена</el-button>
        <el-button type="primary" @click="saveTrainer">Сохранить</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import api from "@/services/api";

interface Trainer {
  id?: number;
  name: string;
  email: string;
  phone: string;
  role: "trainer";
  specialization: string;
  // Другие поля тренера
}

export default defineComponent({
  name: "GymTrainersView",
  setup() {
    const trainers = ref<Trainer[]>([]);
    const showAddForm = ref(false);
    const currentTrainer = ref<Trainer>({
      name: "",
      email: "",
      phone: "",
      role: "trainer",
      specialization: "",
    });

    const fetchTrainers = async () => {
      // Предположим, что gym_admin знает свой gym_id или получает его из профиля
      const gymId = 1;
      const response = await api.get(`/gyms/${gymId}/trainers`);
      trainers.value = response.data;
    };

    const saveTrainer = async () => {
      const gymId = 1;
      if (currentTrainer.value.id) {
        await api.put(
          `/gyms/${gymId}/trainers/${currentTrainer.value.id}`,
          currentTrainer.value
        );
      } else {
        await api.post(`/gyms/${gymId}/trainers`, currentTrainer.value);
      }
      showAddForm.value = false;
      await fetchTrainers();
    };

    const editTrainer = (trainer: Trainer) => {
      currentTrainer.value = { ...trainer };
      showAddForm.value = true;
    };

    const removeTrainer = async (id: number) => {
      const gymId = 1;
      await api.delete(`/gyms/${gymId}/trainers/${id}`);
      await fetchTrainers();
    };

    onMounted(fetchTrainers);

    return {
      trainers,
      showAddForm,
      currentTrainer,
      editTrainer,
      removeTrainer,
      saveTrainer,
    };
  },
});
</script>
