<template>
  <div>
    <h2>Наши тренеры</h2>
    <el-row :gutter="20">
      <el-col :span="8" v-for="trainer in trainers" :key="trainer.id">
        <el-card>
          <h3>{{ trainer.name }}</h3>
          <p>Специализация: {{ trainer.specialization }}</p>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import api from "@/services/api";
import { Trainer } from "@/types";

export default defineComponent({
  name: "TrainersView",
  setup() {
    const trainers = ref<Trainer[]>([]);

    onMounted(async () => {
      try {
        const response = await api.get("/trainer-details/trainers");
        trainers.value = response.data;
      } catch (error) {
        console.error(error);
      }
    });

    return {
      trainers,
    };
  },
});
</script>
