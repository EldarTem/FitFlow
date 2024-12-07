<template>
  <el-menu :default-active="$route.path" router>
    <el-menu-item index="/dashboard/workouts">Тренировки</el-menu-item>
    <el-menu-item index="/dashboard/progress">Прогресс</el-menu-item>
    <el-menu-item index="/dashboard/subscription">Абонемент</el-menu-item>
    <el-menu-item @click="logout">Выход</el-menu-item>
  </el-menu>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useAuthStore } from "@/store/useAuthStore";

export default defineComponent({
  name: "NavigationBar",
  setup() {
    const authStore = useAuthStore();

    const logout = () => {
      authStore.logout();
    };

    return {
      logout,
    };
  },
});
</script>
