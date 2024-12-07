<!-- src/views/NotAuthorizedView.vue -->
<template>
  <div class="not-authorized-page">
    <h2>Нет доступа</h2>
    <p>У вас недостаточно прав для просмотра этой страницы.</p>
    <el-button type="primary" @click="goBack">Вернуться</el-button>
    <el-button @click="goHome">На главную</el-button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "NotAuthorizedView",
  setup() {
    const router = useRouter();

    const goBack = () => {
      router.back();
    };

    const goHome = () => {
      router.push("/dashboard");
    };

    return {
      goBack,
      goHome,
    };
  },
});
</script>

<style scoped>
.not-authorized-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
}

.not-authorized-page h2 {
  margin-bottom: 20px;
}

.not-authorized-page p {
  margin-bottom: 20px;
}
</style>
