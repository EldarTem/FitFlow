<!-- src/components/TrainerProfileInfo.vue -->
<template>
  <div v-if="trainerDetails">
    <h3>Детали тренера</h3>
    <p><strong>Специализация:</strong> {{ trainerDetails.specialization }}</p>
    <p><strong>Опыт (лет):</strong> {{ trainerDetails.experience_years }}</p>
    <p><strong>Биография:</strong> {{ trainerDetails.bio }}</p>
    <p><strong>Сертификаты:</strong> {{ trainerDetails.certifications }}</p>
    <p><strong>Фото:</strong></p>
    <div v-if="trainerDetails.photo_url">
      <img
        :src="trainerDetails.photo_url"
        alt="Фото тренера"
        style="width: 100px; height: 100px; border-radius: 50%"
        @error="handleImageError"
      />
    </div>
    <div v-else>
      <el-avatar icon="UserFilled"></el-avatar>
    </div>
    <el-button type="primary" @click="$emit('edit-trainer')"
      >Редактировать данные тренера</el-button
    >
    <el-button type="danger" @click="$emit('delete-trainer')"
      >Удалить данные тренера</el-button
    >
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { Trainer } from "@/types";
import { UserFilled } from "@element-plus/icons-vue";

export default defineComponent({
  name: "TrainerProfileInfo",
  components: { UserFilled },
  props: {
    trainerDetails: {
      type: Object as PropType<Trainer>,
      default: null,
    },
  },
  methods: {
    handleImageError(e: Event) {
      const img = e.target as HTMLImageElement;
      img.src = "";
    },
  },
});
</script>
