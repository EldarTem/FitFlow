<!-- src/views/SubscriptionView.vue -->
<template>
  <div class="subscription-view">
    <h2>Ваш абонемент</h2>
    <el-card v-if="membership">
      <p><strong>Начало действия:</strong> {{ membership.start_date }}</p>
      <p><strong>Окончание действия:</strong> {{ membership.end_date }}</p>
      <p>
        <strong>Доступные занятия:</strong>
        {{ membership.sessions_included - membership.sessions_used }}
      </p>
    </el-card>
    <div v-else>
      <p>У вас нет активного абонемента.</p>
      <el-button type="primary" @click="purchaseMembership"
        >Купить абонемент</el-button
      >
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { useMembershipStore } from "@/store/useMembershipStore";

export default defineComponent({
  name: "SubscriptionView",
  setup() {
    const membershipStore = useMembershipStore();

    onMounted(async () => {
      await membershipStore.fetchMembership();
    });

    const purchaseMembership = () => {
      // Реализуйте логику покупки абонемента
    };

    return {
      membership: membershipStore.membership,
      purchaseMembership,
    };
  },
});
</script>
