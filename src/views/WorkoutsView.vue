<!-- src/views/WorkoutsView.vue -->
<template>
  <div class="workouts-view">
    <h2>Доступные тренировки</h2>
    <el-table :data="availableSessions" style="width: 100%">
      <el-table-column prop="date" label="Дата" width="150" />
      <el-table-column prop="training_type" label="Тип тренировки" />
      <el-table-column prop="trainer_name" label="Тренер" />
      <el-table-column label="Действие" width="120">
        <template #default="scope">
          <el-button
            type="primary"
            size="small"
            @click="bookSession(scope.row.id)"
            >Записаться</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { useSessionStore } from "@/store/useSessionStore";


export default defineComponent({
  name: "WorkoutsView",
  setup() {
    const sessionStore = useSessionStore();

    onMounted(async () => {
      await sessionStore.fetchAvailableSessions();
    });

    const bookSession = async (sessionId: number) => {
      await sessionStore.bookSession(sessionId);
    };

    return {
      availableSessions: sessionStore.availableSessions,
      bookSession,
    };
  },
});
</script>
