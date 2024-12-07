<template>
  <div class="profile-container" v-if="user">
    <!-- Блок профиля пользователя -->
    <el-card class="profile-card">
      <h2>Профиль</h2>
      <el-row :gutter="20">
        <el-col :span="8"><strong>Имя:</strong></el-col>
        <el-col :span="16">{{ user.name }}</el-col>

        <el-col :span="8"><strong>Email:</strong></el-col>
        <el-col :span="16">{{ user.email }}</el-col>

        <el-col :span="8"><strong>Телефон:</strong></el-col>
        <el-col :span="16">{{ user.phone }}</el-col>

        <el-col :span="8"><strong>Роль:</strong></el-col>
        <el-col :span="16">{{ user.role }}</el-col>
      </el-row>

      <el-button
        type="primary"
        @click="openProfileEditModal"
        class="edit-button"
      >
        Редактировать профиль
      </el-button>

      <el-button type="danger" @click="logout" class="logout-button">
        Выйти из аккаунта
      </el-button>
    </el-card>

    <!-- Блок деталей тренера -->
    <el-card class="trainer-card" v-if="isTrainer && trainerDetails">
      <h2>Детали тренера</h2>
      <el-row :gutter="20">
        <el-col :span="8"><strong>Специализация:</strong></el-col>
        <el-col :span="16">{{ trainerDetails.specialization }}</el-col>

        <el-col :span="8"><strong>Опыт:</strong></el-col>
        <el-col :span="16">{{ trainerDetails.experience_years }} лет</el-col>

        <el-col :span="8"><strong>Биография:</strong></el-col>
        <el-col :span="16">{{ trainerDetails.bio }}</el-col>

        <el-col :span="8"><strong>Сертификаты:</strong></el-col>
        <el-col :span="16">{{ trainerDetails.certifications }}</el-col>
      </el-row>

      <el-button
        type="primary"
        @click="openTrainerEditModal"
        class="edit-button"
      >
        Редактировать детали тренера
      </el-button>
    </el-card>

    <!-- Модалка для редактирования профиля -->
    <el-dialog v-model="profileEditDialogVisible" title="Редактировать профиль">
      <el-form :model="profileEditForm">
        <el-form-item label="Имя">
          <el-input v-model="profileEditForm.name" />
        </el-form-item>
        <el-form-item label="Email">
          <el-input v-model="profileEditForm.email" />
        </el-form-item>
        <el-form-item label="Телефон">
          <el-input v-model="profileEditForm.phone" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="profileEditDialogVisible = false">Отмена</el-button>
        <el-button type="primary" @click="submitProfileEdit"
          >Сохранить</el-button
        >
      </template>
    </el-dialog>

    <!-- Модалка для редактирования деталей тренера -->
    <el-dialog
      v-model="trainerEditDialogVisible"
      title="Редактировать детали тренера"
    >
      <el-form :model="trainerEditForm">
        <el-form-item label="Специализация">
          <el-input v-model="trainerEditForm.specialization" />
        </el-form-item>
        <el-form-item label="Опыт">
          <el-input v-model="trainerEditForm.experience_years" type="number" />
        </el-form-item>
        <el-form-item label="Биография">
          <el-input v-model="trainerEditForm.bio" />
        </el-form-item>
        <el-form-item label="Сертификаты">
          <el-input v-model="trainerEditForm.certifications" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="trainerEditDialogVisible = false">Отмена</el-button>
        <el-button type="primary" @click="submitTrainerEdit"
          >Сохранить</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import { useAuthStore } from "@/store/useAuthStore";
import { useTrainerStore } from "@/store/useTrainerStore";
import { ElNotification } from "element-plus";
import { ProfileEditForm, TrainerEditForm } from "@/types";

export default defineComponent({
  name: "ProfileView",
  setup() {
    const authStore = useAuthStore();
    const trainerStore = useTrainerStore();

    const user = computed(() => authStore.user);
    const isTrainer = computed(() => user.value?.role === "trainer");
    const trainerDetails = computed(() => trainerStore.trainerDetails);

    const profileEditDialogVisible = ref(false);
    const profileEditForm = ref<ProfileEditForm>({
      name: "",
      email: "",
      phone: "",
    });

    const trainerEditDialogVisible = ref(false);
    const trainerEditForm = ref<TrainerEditForm>({
      specialization: "",
      experience_years: 0,
      bio: "",
      certifications: "",
      photo_url: "",
    });

    const openProfileEditModal = () => {
      profileEditForm.value = {
        name: user.value?.name ?? "",
        email: user.value?.email ?? "",
        phone: user.value?.phone ?? "",
      };
      profileEditDialogVisible.value = true;
    };

    const openTrainerEditModal = () => {
      trainerEditForm.value = {
        specialization: trainerDetails.value?.specialization ?? "",
        experience_years: trainerDetails.value?.experience_years ?? 0,
        bio: trainerDetails.value?.bio ?? "",
        certifications: trainerDetails.value?.certifications ?? "",
        photo_url: trainerDetails.value?.photo_url ?? "",
      };
      trainerEditDialogVisible.value = true;
    };

    const logout = () => {
      authStore.logout();
      window.location.href = "/login";
    };

    const submitProfileEdit = async () => {
      await authStore.updateUserProfile(profileEditForm.value);
      ElNotification({
        title: "Успешно",
        message: "Профиль обновлен",
        type: "success",
      });
      profileEditDialogVisible.value = false;
    };

    const submitTrainerEdit = async () => {
      await trainerStore.updateTrainerDetails(
        user.value!.id,
        trainerEditForm.value
      );

      trainerEditDialogVisible.value = false;
    };

    onMounted(() => {
      if (!user.value) authStore.getUserProfile();
      if (isTrainer.value) trainerStore.fetchTrainerDetails(user.value!.id);
    });

    return {
      user,
      isTrainer,
      trainerDetails,
      profileEditDialogVisible,
      profileEditForm,
      trainerEditDialogVisible,
      trainerEditForm,
      openProfileEditModal,
      openTrainerEditModal,
      submitProfileEdit,
      submitTrainerEdit,
      logout,
    };
  },
});
</script>

<style scoped>
.profile-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profile-card,
.trainer-card {
  width: 800px;
  margin-bottom: 20px;
}

.edit-button {
  margin-top: 20px;
}

.logout-button {
  margin-top: 10px;
  background-color: #ff4d4f;
  color: white;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.loading-container p {
  margin-top: 10px;
  color: #999;
}
</style>
