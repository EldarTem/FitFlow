<template>
  <div class="trainer-profile">
    <el-card v-if="trainer">
      <img :src="trainer.photo_url" alt="Trainer Photo" class="trainer-photo" />
      <p><strong>Специализация:</strong> {{ trainer.specialization }}</p>
      <p><strong>Опыт:</strong> {{ trainer.experience_years }} лет</p>
      <p><strong>Биография:</strong> {{ trainer.bio }}</p>
      <p><strong>Сертификаты:</strong> {{ trainer.certifications }}</p>

      <div class="actions">
        <el-button type="primary" @click="openEditModal"
          >Редактировать</el-button
        >
        <el-button type="danger" @click="confirmDelete">Удалить</el-button>
      </div>
    </el-card>
    <el-empty v-else description="Информация о тренере отсутствует" />

    <!-- Диалог для редактирования информации о тренере -->
    <el-dialog
      v-model="editDialogVisible"
      title="Редактировать информацию о тренере"
    >
      <el-form :model="editForm" label-width="120px">
        <el-form-item label="Специализация" required>
          <el-input v-model="editForm.specialization" />
        </el-form-item>
        <el-form-item label="Опыт (лет)" required>
          <el-input type="number" v-model="editForm.experience_years" min="0" />
        </el-form-item>
        <el-form-item label="Биография" required>
          <el-input v-model="editForm.bio" type="textarea" />
        </el-form-item>
        <el-form-item label="Сертификаты" required>
          <el-input v-model="editForm.certifications" />
        </el-form-item>
        <el-form-item label="Фото URL" required>
          <el-input v-model="editForm.photo_url" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">Отмена</el-button>
        <el-button type="primary" @click="submitEdit">Сохранить</el-button>
      </template>
    </el-dialog>

    <!-- Диалог подтверждения удаления -->
    <el-dialog
      title="Подтверждение удаления"
      :visible.sync="confirmDialogVisible"
      width="30%"
    >
      <span>Вы уверены, что хотите удалить свою информацию о тренере?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="confirmDialogVisible = false">Отмена</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import { useAuthStore } from "@/store/useAuthStore";
import { useTrainerDetailsStore } from "@/store/useTrainerDetailsStore";
import { Trainer } from "@/types";
import { ElNotification } from "element-plus";

export default defineComponent({
  name: "TrainerProfileInfo",
  setup() {
    const authStore = useAuthStore();
    const trainerStore = useTrainerDetailsStore();

    const user = computed(() => authStore.user);

    const trainer = ref<Trainer | null>(null);

    const editDialogVisible = ref(false);
    const confirmDialogVisible = ref(false);

    const editForm = ref<Partial<Trainer>>({
      specialization: "",
      experience_years: 0,
      bio: "",
      certifications: "",
      photo_url: "",
    });

    // Метод для получения информации о тренере по ID пользователя
    const fetchTrainerDetails = async () => {
      if (!user.value) return;
      try {
        const fetchedTrainer = await trainerStore.fetchTrainerById(
          user.value.id
        );
        if (fetchedTrainer) {
          trainer.value = fetchedTrainer;
        }
      } catch (error: any) {
        ElNotification.error(
          error?.response?.data?.message ||
            "Не удалось загрузить информацию о тренере"
        );
      }
    };

    const openEditModal = () => {
      if (!trainer.value) {
        ElNotification.error("Информация о тренере не загружена");
        return;
      }
      editForm.value = { ...trainer.value };
      editDialogVisible.value = true;
    };

    const submitEdit = async () => {
      if (!trainer.value) {
        ElNotification.error("Информация о тренере не загружена");
        return;
      }
      // Валидация полей (можно добавить дополнительные проверки)
      if (!editForm.value.specialization) {
        ElNotification.error("Специализация обязательна");
        return;
      }
      if (
        editForm.value.experience_years === undefined ||
        editForm.value.experience_years < 0
      ) {
        ElNotification.error("Опыт должен быть неотрицательным числом");
        return;
      }
      if (!editForm.value.bio) {
        ElNotification.error("Биография обязательна");
        return;
      }
      if (!editForm.value.certifications) {
        ElNotification.error("Сертификаты обязательны");
        return;
      }
      if (!editForm.value.photo_url) {
        ElNotification.error("Фото URL обязателен");
        return;
      }

      try {
        // Используем user_id вместо id
        await trainerStore.updateTrainerDetails(user.value.id, editForm.value);
        ElNotification.success("Информация о тренере успешно обновлена");
        editDialogVisible.value = false;
        await fetchTrainerDetails(); // Обновляем локальные данные
      } catch (error: any) {
        ElNotification.error(
          error?.response?.data?.message ||
            "Не удалось обновить информацию о тренере"
        );
      }
    };

    const confirmDelete = () => {
      confirmDialogVisible.value = true;
    };

    onMounted(() => {
      fetchTrainerDetails();
    });

    return {
      trainer,
      editDialogVisible,
      editForm,
      openEditModal,
      submitEdit,
      confirmDialogVisible,
      confirmDelete,
    };
  },
});
</script>

<style scoped>
.trainer-profile {
  width: 100%;
  max-width: 800px;
}
.trainer-photo {
  width: 150px;
  height: 150px;
  border-radius: 50%;
}
.actions {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}
</style>
