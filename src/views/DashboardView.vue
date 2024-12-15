<!-- src/views/Dashboard.vue -->
<template>
  <div class="dashboard-page">
    <component :is="dashboardComponent" />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useAuthStore } from "@/store/useAuthStore";
import ClientDashboard from "@/components/ClientDashboard.vue";
import TrainerDashboard from "@/components/TrainerDashboard.vue";
import AdminDashboard from "@/components/AdminDashboard.vue";
import SuperAdminDashboard from "@/components/SuperAdminDashboard.vue";

export default defineComponent({
  name: "Dashboard",
  components: {
    ClientDashboard,
    TrainerDashboard,
    AdminDashboard,
    SuperAdminDashboard,
  },
  setup() {
    const authStore = useAuthStore();

    const dashboardComponent = computed(() => {
      if (!authStore.user) return null;

      switch (authStore.user.role) {
        case "user":
          return "ClientDashboard";
        case "trainer":
          return "TrainerDashboard";
        case "gym_admin":
          return "AdminDashboard";
        case "super_admin":
          return "SuperAdminDashboard";
        default:
          return null;
      }
    });

    return {
      dashboardComponent,
    };
  },
});
</script>

<style scoped>
.dashboard-page {
  padding: 20px;
}
</style>
