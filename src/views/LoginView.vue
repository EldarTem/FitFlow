<template>
  <div class="login-form">
    <el-form :model="loginForm" @submit.prevent="handleLogin">
      <el-form-item label="Email">
        <el-input v-model="loginForm.email" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="Пароль">
        <el-input v-model="loginForm.password" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit">Войти</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import { useAuthStore } from "@/store/useAuthStore";

export default defineComponent({
  name: "LoginView",
  setup() {
    const authStore = useAuthStore();
    const loginForm = reactive({
      email: "",
      password: "",
    });

    const handleLogin = async () => {
      await authStore.login(loginForm.email, loginForm.password);
    };

    return {
      loginForm,
      handleLogin,
    };
  },
});
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 50px 0;
}
</style>
