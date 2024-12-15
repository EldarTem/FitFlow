<!-- src/components/TrainerDashboard.vue -->
<template>
  <div class="trainer-dashboard">
    <section class="welcome-section">
      <h1>Добро пожаловать, {{ trainer.name }}!</h1>
      <p>Специализация: {{ trainer.specialization }}</p>
    </section>

    <section class="today-schedule">
      <h2>Расписание на Сегодня</h2>
      <el-table :data="todaySessions" style="width: 100%">
        <el-table-column prop="start_time" label="Начало" />
        <el-table-column prop="end_time" label="Конец" />
        <el-table-column prop="client_name" label="Клиент" />
        <el-table-column label="Статус">
          <template #default="scope">
            <el-tag :type="getStatusTag(scope.row.status)">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </section>

    <section class="clients-list">
      <h2>Список Клиентов</h2>
      <el-table :data="clients" style="width: 100%">
        <el-table-column prop="name" label="Имя" />
        <el-table-column prop="email" label="Email" />
        <el-table-column prop="phone" label="Телефон" />
        <el-table-column label="Действия">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              @click="viewClient(scope.row.id)"
            >
              Просмотреть
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </section>

    <section class="availability-management">
      <h2>Управление Доступностью</h2>
      <!-- Заглушка для календаря доступности -->
      <p>Календарь доступности будет доступен позже.</p>
      <el-button type="primary" @click="openAvailabilityModal"
        >Редактировать Доступность</el-button
      >
    </section>

    <section class="statistics">
      <h2>Статистика</h2>
      <el-card>
        <!-- Заглушка для графика статистики -->
        <p>График статистики будет доступен позже.</p>
      </el-card>
    </section>

    <!-- Заглушка для модального окна управления доступностью -->
    <el-dialog
      title="Редактировать Доступность"
      v-model="showAvailabilityModal"
      width="600px"
    >
      <p>Форма управления доступностью будет реализована позже.</p>
      <template #footer>
        <el-button @click="showAvailabilityModal = false">Закрыть</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import type { TrainingSession, Trainer } from "@/types";
import { ElNotification } from "element-plus";

export default defineComponent({
  name: "TrainerDashboard",
  setup() {
    // Заглушка: Тренер
    const trainer = ref<Trainer>({
      id: 2,
      name: "Петр Петров",
      email: "petr@example.com",
      phone: "+7 123 456-78-90",
      role: "trainer",
      specialization: "Бодибилдинг",
      experience_years: 5,
      bio: "Петр - опытный тренер по бодибилдингу.",
      certifications: "NASM, IFBB",
      photo_url: "",
    });

    // Заглушка: Тренировки на сегодня
    const todaySessions = ref<TrainingSession[]>([
      {
        id: 1,
        day_of_week: "Понедельник",
        start_time: "10:00",
        end_time: "11:00",
        trainer_name: "Петр Петров",
        client_name: "Иван Иванов",
        status: "confirmed",
      },
      {
        id: 2,
        day_of_week: "Понедельник",
        start_time: "12:00",
        end_time: "13:00",
        trainer_name: "Петр Петров",
        client_name: "Сергей Сергеев",
        status: "pending",
      },
    ]);

    // Заглушка: Список клиентов
    const clients = ref<Trainer[]>([
      {
        id: 1,
        name: "Иван Иванов",
        email: "ivan@example.com",
        phone: "+7 123 456-78-90",
        role: "user",
      },
      {
        id: 2,
        name: "Сергей Сергеев",
        email: "sergey@example.com",
        phone: "+7 987 654-32-10",
        role: "user",
      },
    ]);

    // Модальное окно
    const showAvailabilityModal = ref(false);

    onMounted(() => {
      // Здесь можно загрузить реальные данные, если сторы будут реализованы
    });

    const viewClient = (client_id: number) => {
      // Заглушка для просмотра клиента
      ElNotification.info(`Просмотр клиента с ID: ${client_id}`);
    };

    const openAvailabilityModal = () => {
      showAvailabilityModal.value = true;
    };

    const getStatusTag = (status: string) => {
      switch (status) {
        case "confirmed":
          return "success";
        case "pending":
          return "info";
        case "cancelled":
          return "danger";
        default:
          return "info";
      }
    };

    return {
      trainer,
      todaySessions,
      clients,
      showAvailabilityModal,
      viewClient,
      openAvailabilityModal,
      getStatusTag,
    };
  },
});
</script>

<style scoped>
.trainer-dashboard {
  padding: 20px;
}

.welcome-section {
  margin-bottom: 20px;
}

.today-schedule,
.clients-list,
.availability-management,
.statistics {
  margin-bottom: 30px;
}

.trainer-card {
  cursor: pointer;
  text-align: center;
  padding: 10px;
}

.trainer-photo-container {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}

.trainer-photo {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}

.trainer-avatar {
  width: 100px;
  height: 100px;
  font-size: 50px;
  background-color: #e5e5e5;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
