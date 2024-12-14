<!-- src/components/Header.vue -->
<template>
  <div class="menu-container">
    <el-menu
      :default-active="$route.path"
      mode="horizontal"
      router
      collapse-transition="false"
      class="menu-container"
    >
      <div class="cont-logo">
        <el-menu-item index="/dashboard" class="logo-link">
          <div class="logo">
            <el-icon><UserFilled /></el-icon>
            <span>FitFlow</span>
          </div>
        </el-menu-item>
      </div>
      <div class="cont-b">
        <template v-if="user">
          <template v-if="isUser">
            <el-menu-item index="/dashboard/workouts">Тренировки</el-menu-item>
          </template>

          <template v-if="isTrainer">
            <el-menu-item index="/dashboard/trainer-schedule"
              >Моё расписание</el-menu-item
            >
            <el-menu-item index="/dashboard/books">Мои тренировки</el-menu-item>
          </template>
          <template v-if="isGymAdmin">
            <el-menu-item index="/dashboard/clients" tabindex="-1"
              >Клиенты</el-menu-item
            >
            <el-menu-item index="/dashboard/gym-trainers" tabindex="-1"
              >Тренеры зала</el-menu-item
            >
          </template>

          <template v-if="isSuperAdmin">
            <el-menu-item index="/dashboard/clients">Клиенты</el-menu-item>
            <el-menu-item index="/dashboard/full-trainers"
              >Тренеры</el-menu-item
            >

            <el-menu-item index="/dashboard/gyms">Спортзалы</el-menu-item>
          </template>

          <el-menu-item index="/dashboard/profile">Профиль</el-menu-item>
          <el-menu-item>
            <el-button type="danger" size="small" @click="logout"
              >Выйти</el-button
            >
          </el-menu-item>
        </template>
        <template v-else>
          <el-menu-item index="/login">Войти</el-menu-item>
          <el-menu-item index="/register">Регистрация</el-menu-item>
        </template>
      </div>
    </el-menu>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useAuthStore } from "@/store/useAuthStore";
import { UserFilled } from "@element-plus/icons-vue";

export default defineComponent({
  name: "Header",
  components: {
    UserFilled,
  },
  setup() {
    const authStore = useAuthStore();
    const user = computed(() => authStore.user);

    const isUser = computed(() => user.value?.role === "user");
    const isTrainer = computed(() => user.value?.role === "trainer");
    const isGymAdmin = computed(() => user.value?.role === "gym_admin");
    const isSuperAdmin = computed(() => user.value?.role === "super_admin");

    const logout = () => {
      authStore.logout();
    };

    return {
      user,
      isUser,
      isTrainer,
      isGymAdmin,
      isSuperAdmin,
      logout,
    };
  },
});
</script>

<style scoped>
.logo-link {
  text-decoration: none;
  color: inherit;
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  font-size: 24px;
  font-weight: bold;
}

.logo el-icon {
  margin-right: 10px;
}
.menu-container {
  display: flex;
  align-items: center;
  justify-content: space-between; /* Равномерное распределение */
  width: 100%; /* Меню занимает всю ширину строки */
  overflow: visible; /* Убираем обрезание пунктов */
}

.el-menu {
  display: flex !important; /* Принудительное использование flexbox */
  flex-wrap: nowrap !important; /* Отключаем перенос строк */
  justify-content: space-between; /* Выравниваем пункты слева */
  width: 100%; /* Меню занимает всю ширину */
  overflow: visible !important; /* Убираем скрытие элементов */
}

.el-menu-item {
  white-space: nowrap !important; /* Отключаем перенос текста */
  margin: 0 15px; /* Отступы между пунктами меню */
  flex-shrink: 0; /* Запрещаем сжимание пунктов */
}

.cont-b {
  display: flex;
}
</style>
