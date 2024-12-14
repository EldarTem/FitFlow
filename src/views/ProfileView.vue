<template>
  <div class="profile-container" v-if="user">
    <UserProfileInfo @edit-profile="openProfileEditModal" @logout="logout" />
    <!-- Компонент TrainerProfileInfo отображается только для тренера -->
    <TrainerProfileInfo v-if="isTrainer" />
    <!-- Компонент UserGymInfo отображается для всех, кроме супер-администратора -->
    <UserGymInfo v-if="!isSuperAdmin" />

    <!-- Диалог для редактирования профиля пользователя -->
    <el-dialog v-model="profileEditDialogVisible" title="Редактировать профиль">
      <el-form :model="profileEditForm" label-width="120px">
        <el-form-item label="Имя" required>
          <el-input v-model="profileEditForm.name" />
        </el-form-item>
        <el-form-item label="Email" required>
          <el-input v-model="profileEditForm.email" />
        </el-form-item>
        <el-form-item label="Телефон">
          <el-input
            v-model="profileEditForm.phone"
            @input="
              profileEditForm.phone = formatPhone(profileEditForm.phone || '')
            "
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="profileEditDialogVisible = false">Отмена</el-button>
        <el-button type="primary" @click="submitProfileEdit"
          >Сохранить</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import { useAuthStore } from "@/store/useAuthStore";
import UserProfileInfo from "@/components/UserProfileInfo.vue";
import UserGymInfo from "@/components/UserGymInfo.vue";
import TrainerProfileInfo from "@/components/TrainerProfileInfo.vue";
import { User } from "@/types";
import { ElNotification } from "element-plus";

type ProfileEditForm = Partial<User>;

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
  name: "ProfileView",
  components: { UserProfileInfo, UserGymInfo, TrainerProfileInfo },
  setup() {
    const authStore = useAuthStore();

    const user = computed(() => authStore.user);

    // Вычисляемые свойства для проверки роли пользователя
    const isSuperAdmin = computed(() => user.value?.role === "super_admin");
    const isTrainer = computed(() => user.value?.role === "trainer");

    const profileEditDialogVisible = ref(false);
    const profileEditForm = ref<ProfileEditForm>({
      name: user.value?.name,
      email: user.value?.email,
      phone: user.value?.phone,
    });

    const openProfileEditModal = () => {
      profileEditForm.value = {
        name: user.value?.name,
        email: user.value?.email,
        phone: user.value?.phone,
      };
      profileEditDialogVisible.value = true;
    };

    const logout = () => {
      authStore.logout();
    };

    const submitProfileEdit = async () => {
      if (!isValidEmail(profileEditForm.value.email || "")) {
        ElNotification.error("Некорректный email");
        return;
      }
      try {
        await authStore.updateUserProfile(profileEditForm.value);
        ElNotification.success("Профиль успешно обновлен");
        profileEditDialogVisible.value = false;
      } catch (error: any) {
        ElNotification.error(
          error?.response?.data?.message || "Не удалось обновить профиль"
        );
      }
    };

    onMounted(() => {
      if (!user.value) authStore.getUserProfile();
    });

    return {
      user,
      isSuperAdmin,
      isTrainer,
      profileEditDialogVisible,
      profileEditForm,
      openProfileEditModal,
      submitProfileEdit,
      logout,
      formatPhone,
      isValidEmail,
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
</style>
