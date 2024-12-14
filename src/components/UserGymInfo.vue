<!-- src/components/UserGymInfo.vue -->
<template>
  <el-card class="gym-card">
    <h2>Мой зал</h2>
    <p><strong>Название:</strong> City Gym</p>
    <p><strong>Адрес:</strong> 123 Fitness St, Metropolis</p>
    <p><strong>Телефон:</strong> 1234567894</p>
    <p><strong>Email:</strong>info@citygym.com</p>
  </el-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "UserGymInfo",
});
</script>

<style scoped>
.gym-card {
  width: 800px;
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
