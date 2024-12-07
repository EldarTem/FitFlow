<template>
  <div class="register-form">
    <el-form :model="registerForm" @submit.prevent="handleRegister">
      <el-form-item label="Имя">
        <el-input v-model="registerForm.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="Email">
        <el-input v-model="registerForm.email" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="Телефон">
        <el-input v-model="registerForm.phone" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="Пароль">
        <el-input v-model="registerForm.password" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit"
          >Зарегистрироваться</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import { useAuthStore } from "@/store/useAuthStore";

export default defineComponent({
  name: "RegisterView",
  setup() {
    const authStore = useAuthStore();
    const registerForm = reactive({
      name: "",
      email: "",
      phone: "",
      password: "",
    });

    const handleRegister = async () => {
      await authStore.register(
        registerForm.name,
        registerForm.email,
        registerForm.password,
        registerForm.phone
      );
    };

    return {
      registerForm,
      handleRegister,
    };
  },
});
</script>

<style scoped>
.register-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 50px 0;
}
</style>
