<!-- src/components/Header.vue -->
<template>
  <el-header height="60px" class="header">
    <router-link to="/dashboard" class="logo-link">
      <div class="logo">
        <el-icon><UserFilled /></el-icon>
        <span>FitFlow</span>
      </div>
    </router-link>
    <el-menu
      :default-active="$route.path"
      mode="horizontal"
      router
      class="menu"
    >
      <!-- Показываем пункты только если пользователь авторизован -->
      <template v-if="user">
        <!-- Пункты для user и/или trainer -->
        <el-menu-item v-if="isUserOrTrainer" index="/dashboard/workouts"
          >Тренировки</el-menu-item
        >
        <el-menu-item v-if="isUserOrTrainer" index="/dashboard/progress"
          >Прогресс</el-menu-item
        >

        <!-- Только user -->
        <el-menu-item v-if="isUser" index="/dashboard/subscription"
          >Абонемент</el-menu-item
        >

        <!-- Для super_admin, gym_admin, trainer -->
        <el-menu-item
          v-if="isSuperAdmin || isGymAdmin || isTrainer"
          index="/dashboard/trainers"
          >Тренеры</el-menu-item
        >

        <!-- Профиль доступен всем авторизованным -->
        <el-menu-item index="/dashboard/profile">Профиль</el-menu-item>

        <!-- Только trainer -->

        <el-menu-item v-if="isTrainer" index="/dashboard/trainer-schedule"
          >Мое расписание</el-menu-item
        >

        <!-- gym_admin -->
        <el-menu-item v-if="isGymAdmin" index="/dashboard/manage-gym"
          >Управление залом</el-menu-item
        >

        <!-- super_admin -->
        <el-menu-item v-if="isSuperAdmin" index="/dashboard/gyms"
          >Залы</el-menu-item
        >
        <el-menu-item v-if="isSuperAdmin" index="/dashboard/users"
          >Пользователи</el-menu-item
        >
      </template>
      <!-- Если нет пользователя (не авторизован), можно здесь добавить пункты 'Login', 'Register', если нужно -->
    </el-menu>
  </el-header>
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
    const user = authStore.user;

    const isUser = computed(() => user?.role === "user");
    const isTrainer = computed(() => user?.role === "trainer");
    const isGymAdmin = computed(() => user?.role === "gym_admin");
    const isSuperAdmin = computed(() => user?.role === "super_admin");
    const isUserOrTrainer = computed(
      () => user && (user.role === "user" || user.role === "trainer")
    );

    return {
      user,
      isUser,
      isTrainer,
      isGymAdmin,
      isSuperAdmin,
      isUserOrTrainer,
    };
  },
});
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  padding: 0 20px;
  background-color: #fff;
  border-bottom: 1px solid #ebeef5;
}

.logo-link {
  text-decoration: none; /* Убираем подчеркивание ссылки */
  color: inherit; /* Наследуем цвет текста */
  display: flex; /* Чтобы весь блок был кликабельным */
}

.logo {
  display: flex;
  align-items: center;
  font-size: 24px;
  font-weight: bold;
  margin-right: 50px;
}

.logo el-icon {
  margin-right: 10px;
}

.menu {
  flex-grow: 1;
}

.menu .el-menu-item {
  font-size: 16px;
}
</style>
