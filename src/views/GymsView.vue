<!-- src/views/GymsView.vue -->
<template>
  <div>
    <h2>Управление залами (Только для super_admin)</h2>
    <el-table :data="gyms" style="width: 100%">
      <el-table-column prop="name" label="Название" />
      <el-table-column prop="address" label="Адрес" />
      <el-table-column label="Действия">
        <template #default="scope">
          <el-button @click="editGym(scope.row)">Изменить</el-button>
          <el-button type="danger" @click="deleteGym(scope.row.id)"
            >Удалить</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-button type="primary" @click="showAddForm = true"
      >Добавить зал</el-button
    >

    <el-dialog title="Добавить/Изменить зал" :visible.sync="showAddForm">
      <el-form :model="currentGym">
        <el-form-item label="Название">
          <el-input v-model="currentGym.name"></el-input>
        </el-form-item>
        <el-form-item label="Адрес">
          <el-input v-model="currentGym.address"></el-input>
        </el-form-item>
        <el-form-item label="Телефон">
          <el-input v-model="currentGym.phone"></el-input>
        </el-form-item>
        <el-form-item label="Email">
          <el-input v-model="currentGym.email"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="showAddForm = false">Отмена</el-button>
        <el-button type="primary" @click="saveGym">Сохранить</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import api from "@/services/api";

interface Gym {
  id?: number;
  name: string;
  address: string;
  phone: string;
  email: string;
}

export default defineComponent({
  name: "GymsView",
  setup() {
    const gyms = ref<Gym[]>([]);
    const showAddForm = ref(false);
    const currentGym = ref<Gym>({
      name: "",
      address: "",
      phone: "",
      email: "",
    });

    const fetchGyms = async () => {
      const response = await api.get("/gyms");
      gyms.value = response.data;
    };

    const saveGym = async () => {
      if (currentGym.value.id) {
        // Обновление
        await api.put(`/gyms/${currentGym.value.id}`, currentGym.value);
      } else {
        // Добавление
        await api.post("/gyms", currentGym.value);
      }
      showAddForm.value = false;
      await fetchGyms();
    };

    const editGym = (gym: Gym) => {
      currentGym.value = { ...gym };
      showAddForm.value = true;
    };

    const deleteGym = async (id: number) => {
      await api.delete(`/gyms/${id}`);
      await fetchGyms();
    };

    onMounted(fetchGyms);

    return {
      gyms,
      showAddForm,
      currentGym,
      editGym,
      deleteGym,
      saveGym,
    };
  },
});
</script>
