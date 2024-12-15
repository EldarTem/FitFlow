<!-- src/components/AdminDashboard.vue -->
<template>
  <div class="admin-dashboard">
    <section class="welcome-section">
      <h1>Добро пожаловать, Администратор!</h1>
    </section>

    <section class="overview-statistics">
      <h2>Обзор Статистики</h2>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card>
            <h3>Пользователи</h3>
            <p>{{ stats.users }}</p>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card>
            <h3>Тренеры</h3>
            <p>{{ stats.trainers }}</p>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card>
            <h3>Активные Тренировки</h3>
            <p>{{ stats.activeTrainings }}</p>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card>
            <h3>Завершённые Тренировки</h3>
            <p>{{ stats.completedTrainings }}</p>
          </el-card>
        </el-col>
      </el-row>
    </section>

    <section class="user-management">
      <h2>Управление Пользователями</h2>
      <el-table :data="users" style="width: 100%">
        <el-table-column prop="id" label="ID" />
        <el-table-column prop="name" label="Имя" />
        <el-table-column prop="email" label="Email" />
        <el-table-column prop="role" label="Роль" />
        <el-table-column label="Действия">
          <template #default="scope">
            <el-button type="primary" size="small" @click="editUser(scope.row)">
              Редактировать
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="deleteUser(scope.row.id)"
            >
              Удалить
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" @click="openUserModal"
        >Добавить Пользователя</el-button
      >
    </section>

    <section class="training-monitoring">
      <h2>Мониторинг Тренировок</h2>
      <el-table :data="allTrainings" style="width: 100%">
        <el-table-column prop="id" label="ID" />
        <el-table-column prop="day_of_week" label="День недели" />
        <el-table-column prop="start_time" label="Начало" />
        <el-table-column prop="end_time" label="Конец" />
        <el-table-column prop="trainer_name" label="Тренер" />
        <el-table-column prop="client_name" label="Клиент" />
      </el-table>
    </section>

    <section class="reports-analytics">
      <h2>Отчёты и Аналитика</h2>
      <el-card>
        <!-- Заглушка для графика аналитики -->
        <p>График аналитики будет доступен позже.</p>
      </el-card>
      <el-button @click="exportReports">Экспортировать Отчёты</el-button>
    </section>

    <section class="system-settings">
      <h2>Системные Настройки</h2>
      <el-form>
        <el-form-item label="Время работы">
          <el-time-picker
            v-model="systemSettings.work_start"
            placeholder="Начало"
          />
          <el-time-picker
            v-model="systemSettings.work_end"
            placeholder="Конец"
          />
        </el-form-item>
        <el-form-item label="Лимиты Записей">
          <el-input-number v-model="systemSettings.maxEnrollments" :min="1" />
        </el-form-item>
        <el-button type="primary" @click="saveSettings"
          >Сохранить Настройки</el-button
        >
      </el-form>
    </section>

    <!-- Модальное окно добавления пользователя -->
    <el-dialog
      title="Добавить Пользователя"
      v-model="showUserModal"
      width="600px"
    >
      <el-form :model="userForm" label-width="120px">
        <el-form-item label="Имя" required>
          <el-input v-model="userForm.name" />
        </el-form-item>
        <el-form-item label="Email" required>
          <el-input v-model="userForm.email" />
        </el-form-item>
        <el-form-item label="Пароль" required>
          <el-input type="password" v-model="userForm.password" />
        </el-form-item>
        <el-form-item label="Роль" required>
          <el-select v-model="userForm.role" placeholder="Выберите роль">
            <el-option label="Клиент" value="user"></el-option>
            <el-option label="Тренер" value="trainer"></el-option>
            <el-option label="Администратор" value="admin"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showUserModal = false">Отмена</el-button>
        <el-button type="primary" @click="addUser">Добавить</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { ElNotification } from "element-plus";
import type { Admin, TrainingSession, SystemSettings, UserForm } from "@/types";

export default defineComponent({
  name: "AdminDashboard",
  setup() {
    // Заглушка: Статистика
    const stats = ref<{
      users: number;
      trainers: number;
      activeTrainings: number;
      completedTrainings: number;
    }>({
      users: 100, // Заглушка
      trainers: 20, // Заглушка
      activeTrainings: 50, // Заглушка
      completedTrainings: 200, // Заглушка
    });

    // Заглушка: Пользователи
    const users = ref<Admin[]>([
      {
        id: 1,
        name: "Иван Иванов",
        email: "ivan@example.com",
        role: "user",
      },
      {
        id: 2,
        name: "Петр Петров",
        email: "petr@example.com",
        role: "trainer",
      },
      {
        id: 3,
        name: "Сергей Сергеев",
        email: "sergey@example.com",
        role: "admin",
      },
    ]);

    // Заглушка: Тренировки
    const allTrainings = ref<TrainingSession[]>([
      {
        id: 1,
        day_of_week: "Понедельник",
        start_time: "10:00",
        end_time: "11:00",
        trainer_name: "Петр Петров",
        client_name: "Иван Иванов",
      },
      {
        id: 2,
        day_of_week: "Вторник",
        start_time: "12:00",
        end_time: "13:00",
        trainer_name: "Петр Петров",
        client_name: "Сергей Сергеев",
      },
    ]);

    // Заглушка: Аналитика
    const analyticsData = ref({
      // Данные для графика аналитики
    });

    // Заглушка: Системные настройки
    const systemSettings = ref<SystemSettings>({
      work_start: "09:00",
      work_end: "18:00",
      maxEnrollments: 5,
    });

    // Модальное окно
    const showUserModal = ref(false);
    const userForm = ref<UserForm>({
      name: "",
      email: "",
      password: "",
      role: "user",
    });

    onMounted(() => {
      // Здесь можно загрузить реальные данные, если сторы будут реализованы
    });

    const openUserModal = () => {
      userForm.value = {
        name: "",
        email: "",
        password: "",
        role: "user",
      };
      showUserModal.value = true;
    };

    const addUser = async () => {
      try {
        // Заглушка: Добавление пользователя
        const newUser: Admin = {
          id: users.value.length + 1,
          name: userForm.value.name,
          email: userForm.value.email,
          role: userForm.value.role as "user" | "trainer" | "admin",
        };
        users.value.push(newUser);
        ElNotification.success("Пользователь успешно добавлен");
        showUserModal.value = false;
      } catch (error: any) {
        ElNotification.error(
          error?.response?.data?.message || "Не удалось добавить пользователя"
        );
      }
    };

    const editUser = (user: Admin) => {
      // Заглушка: Реализуйте логику редактирования пользователя
      ElNotification.info(`Редактировать пользователя с ID: ${user.id}`);
    };

    const deleteUser = async (user_id: number) => {
      try {
        // Заглушка: Удаление пользователя
        users.value = users.value.filter((user) => user.id !== user_id);
        ElNotification.success("Пользователь успешно удалён");
      } catch (error: any) {
        ElNotification.error(
          error?.response?.data?.message || "Не удалось удалить пользователя"
        );
      }
    };

    const saveSettings = async () => {
      try {
        // Заглушка: Сохранение системных настроек
        ElNotification.success("Системные настройки успешно обновлены");
      } catch (error: any) {
        ElNotification.error(
          error?.response?.data?.message || "Не удалось обновить настройки"
        );
      }
    };

    const exportReports = () => {
      // Заглушка: Реализуйте логику экспорта отчётов
      ElNotification.info("Отчёты экспортированы");
    };

    return {
      stats,
      users,
      allTrainings,
      analyticsData,
      showUserModal,
      userForm,
      openUserModal,
      addUser,
      editUser,
      deleteUser,
      systemSettings,
      saveSettings,
      exportReports,
    };
  },
});
</script>

<style scoped>
.admin-dashboard {
  padding: 20px;
}

.welcome-section {
  margin-bottom: 20px;
}

.overview-statistics,
.user-management,
.training-monitoring,
.reports-analytics,
.system-settings {
  margin-bottom: 30px;
}
</style>
