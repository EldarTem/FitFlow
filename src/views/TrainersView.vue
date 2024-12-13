<template>
  <div>
    <h2>Наши тренеры</h2>
    <el-row :gutter="20">
      <el-col :span="8" v-for="trainer in trainers" :key="trainer.user_id">
        <el-card>
          <h3>{{ trainer.name }}</h3>
          <p>Специализация: {{ trainer.specialization }}</p>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed } from "vue";
import { useTrainerDetailsStore } from "@/store/useTrainerDetailsStore";

export default defineComponent({
  name: "TrainersView",
  setup() {
    const trainerDetailsStore = useTrainerDetailsStore();

    const trainers = computed(() => trainerDetailsStore.trainers);

    onMounted(async () => {
      await trainerDetailsStore.fetchAllTrainers();
    });

    return { trainers };
  },
});
</script>
