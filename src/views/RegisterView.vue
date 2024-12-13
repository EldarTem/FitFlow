<!-- src/views/RegisterView.vue -->
<template>
  <div class="auth-container">
    <div class="auth-bg">
      <el-card class="auth-card" shadow="hover">
        <div class="auth-header">
          <img src="../assets/vue.svg" alt="Logo" class="auth-logo" />
          <h2>Регистрация</h2>
        </div>
        <el-form
          :model="registerForm"
          @submit.prevent="handleRegister"
          class="auth-form"
        >
          <el-form-item>
            <el-input
              v-model="registerForm.name"
              placeholder="Введите ваше имя"
              prefix-icon="UserFilled"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="registerForm.email"
              placeholder="Введите ваш email"
              prefix-icon="UserFilled"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-input
              :type="passwordVisible ? 'text' : 'password'"
              v-model="registerForm.password"
              placeholder="Введите пароль"
              prefix-icon="Lock"
              clearable
            >
              <template #suffix>
                <el-icon style="cursor: pointer" @click="togglePassword">
                  <component :is="passwordVisible ? Hide : View" />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="registerForm.phone"
              placeholder="Введите ваш телефон"
              prefix-icon="Phone"
              clearable
              @input="onPhoneInput"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              native-type="submit"
              size="large"
              class="auth-button"
              :loading="loading"
              >Зарегистрироваться</el-button
            >
          </el-form-item>
        </el-form>
        <p class="auth-footer">
          Уже есть аккаунт?
          <router-link to="/login" class="auth-footer-link">Войти</router-link>
        </p>
      </el-card>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import { useAuthStore } from "@/store/useAuthStore";
import { UserFilled, Lock, View, Hide, Phone } from "@element-plus/icons-vue";
import { ElLoading } from "element-plus";

export default defineComponent({
  name: "RegisterView",
  components: {
    UserFilled,
    Lock,
    View,
    Hide,
    Phone,
  },
  setup() {
    const authStore = useAuthStore();
    const registerForm = reactive({
      name: "",
      email: "",
      password: "",
      phone: "",
    });
    const passwordVisible = ref(false);
    const loading = ref(false);
    let loadingInstance: any = null;

    const togglePassword = () => {
      passwordVisible.value = !passwordVisible.value;
    };

    const handleRegister = async () => {
      loading.value = true;
      loadingInstance = ElLoading.service({
        text: "Загрузка...",
        background: "rgba(0,0,0,0.3)",
      });
      await authStore.register(
        registerForm.name,
        registerForm.email,
        registerForm.password,
        registerForm.phone
      );
      loading.value = false;
      loadingInstance.close();
    };

    const onPhoneInput = () => {
      registerForm.phone = formatPhone(registerForm.phone);
    };

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

    return {
      registerForm,
      handleRegister,
      passwordVisible,
      togglePassword,
      onPhoneInput,
      formatPhone,
      View,
      Hide,
      loading,
    };
  },
});
</script>

<style scoped>
.auth-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.auth-bg {
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom right, #f0f4f7, #d9e2ec);
  display: flex;
  justify-content: center;
  align-items: center;
}

.auth-card {
  width: 400px;
  text-align: center;
  padding: 20px;
  border-radius: 10px;
}

.auth-header {
  margin-bottom: 20px;
}

.auth-logo {
  width: 80px;
  height: 80px;
  margin-bottom: 10px;
}

.auth-header h2 {
  margin-bottom: 0;
}

.auth-form {
  text-align: left;
}

.auth-button {
  width: 100%;
}

.auth-footer {
  margin-top: 10px;
  font-size: 14px;
}
.auth-footer-link {
  text-decoration: none;
  color: #409eff;
}
.auth-footer-link:hover {
  text-decoration: none;
  color: rgb(121.3, 187.1, 255);
}
</style>
