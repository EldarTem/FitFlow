<!-- src/components/Header.vue -->
<template>
    <router-link to="/dashboard" class="logo-link">
      <div class="logo">
        <el-icon><UserFilled /></el-icon>
        <span>FitFlow</span>
      </div>
    </router-link>
    <div class="menu-container">
      <el-menu :default-active="$route.path" mode="horizontal" router>
        <template v-if="user">
          <template v-if="isUser">
            <el-menu-item index="/dashboard/workouts">Тренировки</el-menu-item>
          </template>

          <template v-if="isTrainer">
            <el-menu-item index="/dashboard/trainer-schedule"
              >Моё расписание</el-menu-item
            >
          </template>
          <template v-if="isGymAdmin">
            <el-menu-item index="/dashboard/clients">Клиенты</el-menu-item>
            <el-menu-item index="/dashboard/gym-trainers"
              >Тренеры зала</el-menu-item
            >
          </template>

          <template v-if="isSuperAdmin">
            <el-menu-item index="/dashboard/gyms">Спортзалы</el-menu-item>
            <el-menu-item index="/dashboard/full-trainers"
              >Тренеры</el-menu-item
            >
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
  margin-left: auto;
}

.menu-container .el-menu-item {
  font-size: 16px;
  margin: 0 5px;
}
</style>
