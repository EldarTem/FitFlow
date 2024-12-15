<!-- src/components/SuperAdminDashboard.vue -->
<template>
  <div class="superadmin-dashboard">
    <section class="welcome-section">
      <h1>Добро пожаловать, Суперадминистратор!</h1>
    </section>

    <section class="system-overview">
      <h2>Обзор Системы</h2>
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
            <h3>Администраторы</h3>
            <p>{{ stats.admins }}</p>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card>
            <h3>Системная Нагрузка</h3>
            <p>{{ stats.systemLoad }}</p>
          </el-card>
        </el-col>
      </el-row>
    </section>

    <section class="admin-management">
      <h2>Управление Администраторами</h2>
      <el-table :data="admins" style="width: 100%">
        <el-table-column prop="id" label="ID" />
        <el-table-column prop="name" label="Имя" />
        <el-table-column prop="email" label="Email" />
        <el-table-column label="Действия">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              @click="editAdmin(scope.row)"
            >
              Редактировать
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="deleteAdmin(scope.row.id)"
            >
              Удалить
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" @click="openAdminModal"
        >Добавить Администратора</el-button
      >
    </section>

    <section class="audit-logs">
      <h2>Аудит и Логи</h2>
      <!-- Заглушка для таблицы логов -->
      <el-table :data="logs" style="width: 100%">
        <el-table-column prop="timestamp" label="Время" />
        <el-table-column prop="user" label="Пользователь" />
        <el-table-column prop="action" label="Действие" />
        <el-table-column prop="details" label="Детали" />
      </el-table>
    </section>

    <section class="performance-monitoring">
      <h2>Мониторинг Производительности</h2>
      <el-card>
        <!-- Заглушка для графика производительности -->
        <p>График производительности будет доступен позже.</p>
      </el-card>
    </section>

    <section class="content-management">
      <h2>Управление Контентом</h2>
      <el-table :data="content" style="width: 100%">
        <el-table-column prop="id" label="ID" />
        <el-table-column prop="title" label="Заголовок" />
        <el-table-column prop="type" label="Тип" />
        <el-table-column label="Действия">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              @click="editContent(scope.row)"
            >
              Редактировать
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="deleteContent(scope.row.id)"
            >
              Удалить
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" @click="openContentModal"
        >Добавить Контент</el-button
      >
    </section>

    <!-- Модальные окна для управления администраторами и контентом -->
    <el-dialog
      title="Добавить Администратора"
      v-model="showAdminModal"
      width="600px"
    >
      <el-form :model="adminForm" label-width="120px">
        <el-form-item label="Имя" required>
          <el-input v-model="adminForm.name" />
        </el-form-item>
        <el-form-item label="Email" required>
          <el-input v-model="adminForm.email" />
        </el-form-item>
        <el-form-item label="Пароль" required>
          <el-input type="password" v-model="adminForm.password" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAdminModal = false">Отмена</el-button>
        <el-button type="primary" @click="addAdmin">Добавить</el-button>
      </template>
    </el-dialog>

    <el-dialog
      title="Добавить Контент"
      v-model="showContentModal"
      width="600px"
    >
      <el-form :model="contentForm" label-width="120px">
        <el-form-item label="Заголовок" required>
          <el-input v-model="contentForm.title" />
        </el-form-item>
        <el-form-item label="Тип" required>
          <el-select v-model="contentForm.type" placeholder="Выберите тип">
            <el-option label="Новость" value="news"></el-option>
            <el-option label="Объявление" value="announcement"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Текст" required>
          <el-input type="textarea" v-model="contentForm.text" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showContentModal = false">Отмена</el-button>
        <el-button type="primary" @click="addContent">Добавить</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import type {
  Admin,
  TrainingSession,
  Content,
  UserForm,
  SystemSettings,
} from "@/types";
import { ElNotification } from "element-plus";

export default defineComponent({
  name: "SuperAdminDashboard",
  setup() {
    // Заглушка: Статистика системы
    const stats = ref<{
      users: number;
      trainers: number;
      admins: number;
      systemLoad: string;
    }>({
      users: 1000, // Заглушка
      trainers: 100, // Заглушка
      admins: 10, // Заглушка
      systemLoad: "Normal", // Заглушка
    });

    // Заглушка: Администраторы
    const admins = ref<Admin[]>([
      {
        id: 1,
        name: "Алексей Смирнов",
        email: "alexey@example.com",
        role: "admin",
      },
      {
        id: 2,
        name: "Мария Иванова",
        email: "maria@example.com",
        role: "admin",
      },
    ]);

    // Заглушка: Логи аудита
    const logs = ref<
      {
        timestamp: string;
        user: string;
        action: string;
        details: string;
      }[]
    >([
      {
        timestamp: "2024-04-27 10:00:00",
        user: "Алексей Смирнов",
        action: "Вход в систему",
        details: "Пользователь вошёл в систему",
      },
      {
        timestamp: "2024-04-27 11:00:00",
        user: "Мария Иванова",
        action: "Добавление пользователя",
        details: "Добавлен пользователь Иван Иванов",
      },
    ]);

    // Заглушка: Данные производительности
    const performanceData = ref({
      // Данные для графика производительности
    });

    // Заглушка: Контент
    const content = ref<Content[]>([
      {
        id: 1,
        title: "Новость 1",
        type: "news",
        text: "Текст новости 1",
      },
      {
        id: 2,
        title: "Объявление 1",
        type: "announcement",
        text: "Текст объявления 1",
      },
    ]);

    // Модальные окна
    const showAdminModal = ref(false);
    const adminForm = ref<UserForm>({
      name: "",
      email: "",
      password: "",
      role: "admin",
    });

    const showContentModal = ref(false);
    const contentForm = ref({
      title: "",
      type: "",
      text: "",
    });

    onMounted(() => {
      // Здесь можно загрузить реальные данные, если сторы будут реализованы
    });

    const addAdmin = async () => {
      try {
        // Заглушка: Добавление администратора
        const newAdmin: Admin = {
          id: admins.value.length + 1,
          name: adminForm.value.name,
          email: adminForm.value.email,
          role: "admin",
        };
        admins.value.push(newAdmin);
        ElNotification.success("Администратор успешно добавлен");
        showAdminModal.value = false;
      } catch (error: any) {
        ElNotification.error(
          error?.response?.data?.message || "Не удалось добавить администратора"
        );
      }
    };

    const editAdmin = (admin: Admin) => {
      // Заглушка: Реализуйте логику редактирования администратора
      ElNotification.info(`Редактировать администратора с ID: ${admin.id}`);
    };

    const deleteAdmin = async (admin_id: number) => {
      try {
        // Заглушка: Удаление администратора
        admins.value = admins.value.filter((admin) => admin.id !== admin_id);
        ElNotification.success("Администратор успешно удалён");
      } catch (error: any) {
        ElNotification.error(
          error?.response?.data?.message || "Не удалось удалить администратора"
        );
      }
    };

    const addContent = async () => {
      try {
        // Заглушка: Добавление контента
        const newContent: Content = {
          id: content.value.length + 1,
          title: contentForm.value.title,
          type: contentForm.value.type,
          text: contentForm.value.text,
        };
        content.value.push(newContent);
        ElNotification.success("Контент успешно добавлен");
        showContentModal.value = false;
      } catch (error: any) {
        ElNotification.error(
          error?.response?.data?.message || "Не удалось добавить контент"
        );
      }
    };

    const editContent = (contentItem: Content) => {
      // Заглушка: Реализуйте логику редактирования контента
      ElNotification.info(`Редактировать контент с ID: ${contentItem.id}`);
    };

    const deleteContent = async (content_id: number) => {
      try {
        // Заглушка: Удаление контента
        content.value = content.value.filter((item) => item.id !== content_id);
        ElNotification.success("Контент успешно удалён");
      } catch (error: any) {
        ElNotification.error(
          error?.response?.data?.message || "Не удалось удалить контент"
        );
      }
    };

    return {
      stats,
      admins,
      logs,
      performanceData,
      content,
      showAdminModal,
      adminForm,
      addAdmin,
      editAdmin,
      deleteAdmin,
      showContentModal,
      contentForm,
      addContent,
      editContent,
      deleteContent,
      exportReports: () => {
        // Заглушка: Экспорт отчётов
        ElNotification.info("Отчёты экспортированы");
      },
      saveSettings: () => {
        // Заглушка: Сохранение системных настроек
        ElNotification.success("Системные настройки успешно обновлены");
      },
    };
  },
});
</script>

<style scoped>
.superadmin-dashboard {
  padding: 20px;
}

.welcome-section {
  margin-bottom: 20px;
}

.system-overview,
.admin-management,
.audit-logs,
.performance-monitoring,
.content-management {
  margin-bottom: 30px;
}
</style>
