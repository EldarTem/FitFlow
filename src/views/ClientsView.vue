<!-- src/views/ClientsView.vue -->
<template>
  <div class="clients-page">
    <h2>Управление клиентами (Только для gym_admin)</h2>
    <el-table :data="clients" style="width: 100%">
      <el-table-column prop="name" label="Имя" />
      <el-table-column prop="email" label="Email" />
      <el-table-column prop="phone" label="Телефон" />
      <el-table-column label="Действия">
        <template #default="scope">
          <el-button @click="editClient(scope.row)">Изменить</el-button>
          <el-button type="danger" @click="removeClient(scope.row.id)"
            >Удалить</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-button type="primary" @click="openAddForm" style="margin-top: 20px">
      Добавить клиента
    </el-button>

    <el-dialog title="Добавить/Изменить клиента" v-model="showForm">
      <el-form :model="currentClient" label-width="120px">
        <el-form-item label="Имя" required>
          <el-input v-model="currentClient.name"></el-input>
        </el-form-item>
        <el-form-item label="Email" required>
          <el-input v-model="currentClient.email" />
        </el-form-item>
        <el-form-item label="Телефон">
          <el-input
            v-model="currentClient.phone"
            @input="
              currentClient.phone = formatPhone(currentClient.phone || '')
            "
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showForm = false">Отмена</el-button>
        <el-button type="primary" @click="saveClient">Сохранить</el-button>
      </template>
    </el-dialog>

    <Loader :loading="uiStore.isLoading" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, reactive } from "vue";
import { useClientStore } from "@/store/useClientStore";
import { useUiStore } from "@/store/useUiStore";
import { ElNotification } from "element-plus";

interface Client {
  id?: number;
  name: string;
  email: string;
  phone?: string;
}

function formatPhone(value: string): string {
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
}

function isValidEmail(email: string): boolean {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}

export default defineComponent({
  name: "ClientsView",
  setup() {
    const clientStore = useClientStore();
    const uiStore = useUiStore();

    const showForm = ref(false);
    const currentClient = reactive<Client>({
      name: "",
      email: "",
      phone: "",
    });

    const openAddForm = () => {
      currentClient.id = undefined;
      currentClient.name = "";
      currentClient.email = "";
      currentClient.phone = "";
      showForm.value = true;
    };

    const editClient = (client: Client) => {
      currentClient.id = client.id;
      currentClient.name = client.name || "";
      currentClient.email = client.email || "";
      currentClient.phone = client.phone || "";
      showForm.value = true;
    };

    const removeClient = async (id?: number) => {
      if (id) {
        await clientStore.deleteClient(id);
      }
    };

    const saveClient = async () => {
      if (!currentClient.name) {
        ElNotification.error("Имя обязательно");
        return;
      }
      if (!isValidEmail(currentClient.email || "")) {
        ElNotification.error("Некорректный email");
        return;
      }

      if (currentClient.id) {
        await clientStore.updateClient({ ...currentClient });
      } else {
        await clientStore.addClient({ ...currentClient });
      }
      showForm.value = false;
    };

    onMounted(() => {
      clientStore.fetchClients();
    });

    return {
      clients: clientStore.clients,
      showForm,
      currentClient,
      openAddForm,
      editClient,
      removeClient,
      saveClient,
      uiStore,
      formatPhone,
      isValidEmail,
    };
  },
});
</script>

<style scoped>
.clients-page {
  padding: 20px;
}
</style>
