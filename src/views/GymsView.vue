<template>
  <div class="gyms-page">
    <h2>Управление залами (Только для super_admin)</h2>
    <el-table :data="gyms" style="width: 100%">
      <el-table-column prop="name" label="Название" />
      <el-table-column prop="address" label="Адрес" />
      <el-table-column prop="phone" label="Телефон" />
      <el-table-column prop="email" label="Email" />
      <el-table-column label="Действия">
        <template #default="scope">
          <el-button @click="editGym(scope.row)">Изменить</el-button>
          <el-button type="danger" @click="removeGym(scope.row.id)"
            >Удалить</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-button type="primary" @click="openAddForm" style="margin-top: 20px"
      >Добавить зал</el-button
    >

    <el-dialog title="Добавить/Изменить зал" v-model="showForm">
      <el-form :model="currentGym" label-width="120px">
        <el-form-item label="Название" required>
          <el-input v-model="currentGym.name"></el-input>
        </el-form-item>
        <el-form-item label="Адрес">
          <el-input v-model="currentGym.address"></el-input>
        </el-form-item>
        <el-form-item label="Телефон">
          <el-input
            v-model="currentGym.phone"
            @input="currentGym.phone = formatPhone(currentGym.phone || '')"
          />
        </el-form-item>
        <el-form-item label="Email">
          <el-input v-model="currentGym.email" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showForm = false">Отмена</el-button>
        <el-button type="primary" @click="saveGym">Сохранить</el-button>
      </template>
    </el-dialog>

    <Loader :loading="uiStore.isLoading" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, reactive } from "vue";
import { useGymStore } from "@/store/useGymStore";
import { Gym } from "@/types";
import { useUiStore } from "@/store/useUiStore";
import { ElNotification } from "element-plus";

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
  name: "GymsView",
  setup() {
    const gymStore = useGymStore();
    const uiStore = useUiStore();

    const showForm = ref(false);
    const currentGym = reactive<Gym>({
      name: "",
      address: "",
      phone: "",
      email: "",
    });

    const openAddForm = () => {
      currentGym.id = undefined;
      currentGym.name = "";
      currentGym.address = "";
      currentGym.phone = "";
      currentGym.email = "";
      showForm.value = true;
    };

    const editGym = (gym: Gym) => {
      currentGym.id = gym.id;
      currentGym.name = gym.name || "";
      currentGym.address = gym.address || "";
      currentGym.phone = gym.phone || "";
      currentGym.email = gym.email || "";
      showForm.value = true;
    };

    const removeGym = async (id?: number) => {
      if (id) {
        await gymStore.deleteGym(id);
      }
    };

    const saveGym = async () => {
      if (!currentGym.name) {
        return;
      }
      if (!isValidEmail(currentGym.email || "")) {
        ElNotification.error("Некорректный email");
        return;
      }
      if (currentGym.id) {
        await gymStore.updateGym({ ...currentGym });
      } else {
        await gymStore.addGym({ ...currentGym });
      }
      showForm.value = false;
    };

    onMounted(() => {
      gymStore.fetchGyms();
    });

    return {
      gyms: gymStore.gyms,
      showForm,
      currentGym,
      openAddForm,
      editGym,
      removeGym,
      saveGym,
      uiStore,
      formatPhone,
      isValidEmail,
    };
  },
});
</script>

<style scoped>
.gyms-page {
  padding: 20px;
}
</style>
