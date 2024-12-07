<!-- src/views/ProgressView.vue -->
<template>
  <div class="progress-view">
    <h2>История тренировок</h2>
    <el-table :data="completedSessions" style="width: 100%">
      <el-table-column prop="date" label="Дата" width="150" />
      <el-table-column prop="training_type" label="Тип тренировки" />
      <el-table-column prop="trainer_name" label="Тренер" />
    </el-table>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { useSessionStore } from "@/store/useSessionStore";

export default defineComponent({
  name: "ProgressView",
  setup() {
    const sessionStore = useSessionStore();

    onMounted(async () => {
      await sessionStore.fetchCompletedSessions();
    });

    return {
      completedSessions: sessionStore.completedSessions,
    };
  },
});
</script>
