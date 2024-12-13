<!-- src/components/UserGymInfo.vue -->
<template>
  <el-card class="gym-card">
    <h2>Мой зал</h2>
    <div v-if="gym">
      <p><strong>Название:</strong> {{ gym.name }}</p>
      <p><strong>Адрес:</strong> {{ gym.address }}</p>
      <p><strong>Телефон:</strong> {{ gym.phone }}</p>
      <p><strong>Email:</strong> {{ gym.email }}</p>
    </div>
    <div v-else>
      <p>Зал не найден.</p>
    </div>
  </el-card>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import api from "@/services/api";

interface Gym {
  id?: number;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
}

export default defineComponent({
  name: "UserGymInfo",
  setup() {
    const gym = ref<Gym | null>(null);

    onMounted(async () => {
      const response = await api.get("/users/my-gym");
      gym.value = response.data;
    });

    return {
      gym,
    };
  },
});
</script>

<style scoped>
.gym-card {
  width: 800px;
  margin-bottom: 20px;
}
</style>
