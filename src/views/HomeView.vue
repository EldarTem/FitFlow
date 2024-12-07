<!-- src/views/HomeView.vue -->
<template>
  <div class="home">
    <el-row type="flex" justify="center" align="middle" class="welcome-section">
      <el-col :span="12" class="text-center">
        <h1>Добро пожаловать в FitFlow</h1>
        <p>Эффективное управление вашим спортзалом начинается здесь.</p>
        <el-button type="primary" size="large" @click="goToLogin"
          >Начать</el-button
        >
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "HomeView",
  setup() {
    const router = useRouter();

    const goToLogin = () => {
      router.push("/login");
    };

    return {
      goToLogin,
    };
  },
});
</script>

<style scoped>
.home {
  min-height: calc(100vh - 120px); /* Учитываем высоту хедера и футера */
}

.welcome-section {
  height: 100%;
}

.text-center {
  text-align: center;
}
</style>
