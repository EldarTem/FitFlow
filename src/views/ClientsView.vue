// src/views/ClientsView.vue
<template>
  <div class="clients-page">
    <h2>Управление клиентами</h2>

    <el-table :data="clients" style="width: 70%" stripe>
      <el-table-column prop="name" label="Имя" />
      <el-table-column prop="email" label="Email" />
      <el-table-column prop="phone" label="Телефон" />
    </el-table>

    <!-- Пагинация -->
    <div class="pagination" v-if="meta.total > meta.limit">
      <el-pagination
        background
        layout="prev, pager, next, jumper"
        :current-page="meta.page"
        :page-size="meta.limit"
        :total="meta.total"
        @current-change="handlePageChange"
      ></el-pagination>
    </div>

    <!-- Компонент Loader -->
    <Loader :loading="uiStore.isLoading" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed } from "vue";
import { useAuthStore } from "@/store/useAuthStore";
import { useUiStore } from "@/store/useUiStore";

export default defineComponent({
  name: "ClientsView",
  setup() {
    const authStore = useAuthStore();
    const uiStore = useUiStore();

    const showForm = ref(false);

    const confirmDialogVisible = ref(false);

    // Обработка смены страницы в пагинации
    const handlePageChange = (page: number) => {
      authStore.fetchAllUsers(page, authStore.meta.limit, "user");
    };

    // Загрузка клиентов при монтировании компонента
    onMounted(() => {
      authStore.fetchAllUsers(1, authStore.meta.limit, "user");
    });

    // Форматирование телефона
    const formatPhone = (value: string): string => {
      let digits = value.replace(/\D/g, "");
      if (!digits.startsWith("7")) {
        digits = "7" + digits;
      }
      let formatted = "+7";
      if (digits.length > 1) {
        formatted += " (" + digits.substring(1, 4);
      }
      if (digits.length >= 5) {
        formatted += ") " + digits.substring(4, 7);
      }
      if (digits.length >= 8) {
        formatted += "-" + digits.substring(7, 9);
      }
      if (digits.length >= 10) {
        formatted += "-" + digits.substring(9, 11);
      }
      return formatted;
    };

    // Валидация email
    const isValidEmail = (email: string): boolean => {
      const re = /\S+@\S+\.\S+/;
      return re.test(email);
    };

    return {
      clients: computed(() => authStore.clients),
      meta: computed(() => authStore.meta),
      showForm,

      uiStore,
      formatPhone,
      isValidEmail,
      handlePageChange,
      confirmDialogVisible,
    };
  },
});
</script>

<style scoped>
.clients-page {
  padding: 20px;
}

.pagination {
  margin: 20px 0;
  text-align: center;
}

.el-table th,
.el-table td {
  text-align: center;
}
</style>
