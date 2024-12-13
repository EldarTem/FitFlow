// src/store/useAuthStore.ts
import { defineStore } from 'pinia';
import api from '@/services/api';
import { AuthState, User } from '@/types';
import router from '@/router';
import { ElNotification } from 'element-plus';
import { useUiStore } from './useUiStore';

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: localStorage.getItem('token'),
    errorMessage: '',
  }),
  actions: {
    async login(email: string, password: string) {
      const uiStore = useUiStore();
      uiStore.showLoader();
      try {
        const response = await api.post('/users/login', { email, password });
        this.token = response.data.token;
        this.user = response.data.user as User;
        localStorage.setItem('token', this.token!);
        router.push('/dashboard');
        ElNotification.success('Вы успешно вошли в систему!');
      } catch (error: any) {
        this.errorMessage =
          error?.response?.data?.message || 'Ошибка при входе';
        ElNotification.error(this.errorMessage);
      } finally {
        uiStore.hideLoader();
      }
    },
    async register(
      name: string,
      email: string,
      password: string,
      phone: string
    ) {
      const uiStore = useUiStore();
      uiStore.showLoader();
      try {
        const response = await api.post('/users/signup', {
          name,
          email,
          password,
          phone,
        });
        this.token = response.data.token;
        await this.getUserProfile();
        localStorage.setItem('token', this.token!);
        router.push('/dashboard');
        ElNotification.success('Регистрация прошла успешно!');
      } catch (error: any) {
        this.errorMessage =
          error?.response?.data?.message || 'Ошибка при регистрации';
        ElNotification.error(this.errorMessage);
      } finally {
        uiStore.hideLoader();
      }
    },
    async getUserProfile() {
      const uiStore = useUiStore();
      uiStore.showLoader();
      try {
        const response = await api.get('/users/profile');
        this.user = response.data as User;
      } catch (error: any) {
        this.errorMessage =
          error?.response?.data?.message || 'Ошибка при загрузке профиля';
        ElNotification.error(this.errorMessage);
        this.logout();
      } finally {
        uiStore.hideLoader();
      }
    },
    async updateUserProfile(details: Partial<User>) {
      const uiStore = useUiStore();
      uiStore.showLoader();
      try {
        await api.put('/users/profile', details);
        await this.getUserProfile();
        ElNotification.success('Профиль обновлён');
      } catch (error: any) {
        ElNotification.error(
          error?.response?.data?.message || 'Не удалось обновить профиль'
        );
        throw error;
      } finally {
        uiStore.hideLoader();
      }
    },
    async deleteUser() {
      const uiStore = useUiStore();
      uiStore.showLoader();
      try {
        await api.delete('/users/profile');
        ElNotification.success('Пользователь удалён');
        this.logout();
      } catch (error: any) {
        ElNotification.error(
          error?.response?.data?.message || 'Не удалось удалить пользователя'
        );
      } finally {
        uiStore.hideLoader();
      }
    },
    logout() {
      this.user = null;
      this.token = null;
      this.errorMessage = '';
      localStorage.removeItem('token');
      router.push('/login');
    },

    // Новый метод для повышения роли пользователя
    async assignRoleToUser(user_id: number, role: string) {
      const uiStore = useUiStore();
      uiStore.showLoader();
      try {
        await api.post('/users/promote', { user_id, role });
        ElNotification.success('Роль успешно назначена');
      } catch (error: any) {
        ElNotification.error(
          error?.response?.data?.message ||
            'Не удалось назначить роль пользователю'
        );
      } finally {
        uiStore.hideLoader();
      }
    },
  },
});
