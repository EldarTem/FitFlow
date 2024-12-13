<template>
  <div class="subscription-view">
    <h2>Ваш абонемент</h2>
    <el-card>
      <p><strong>Начало действия:</strong></p>
      <p><strong>Окончание действия:</strong></p>
      <p>
        <strong>Доступные занятия:</strong>
      </p>
    </el-card>
    <div>
      <p>У вас нет активного абонемента.</p>
      <el-button type="primary">Купить абонемент</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "SubscriptionView",
});
</script>

<style scoped>
.subscription-view {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}
</style>
