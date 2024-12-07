// src/store/useAuthStore.ts

import { defineStore } from 'pinia';
import api from '@/services/api';
import router from '@/router';
import { AuthState, User, UpdateUserProfile } from '@/types';
import { ElNotification } from 'element-plus';

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: localStorage.getItem('token'),
    errorMessage: '',
  }),
  actions: {
    async login(email: string, password: string) {
      try {
        const response = await api.post('/users/login', { email, password });
        this.token = response.data.token;
        this.user = response.data.user as User;
        localStorage.setItem('token', this.token!);
        router.push('/dashboard');
      } catch (error: any) {
        console.error(error);
        this.errorMessage =
          error?.response?.data?.message || 'Ошибка при входе';
        ElNotification({
          title: 'Ошибка входа',
          message: this.errorMessage,
          type: 'error',
        });
      }
    },
    async register(
      name: string,
      email: string,
      password: string,
      phone: string
    ) {
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
      } catch (error: any) {
        console.error(error);
        this.errorMessage =
          error?.response?.data?.message || 'Ошибка при регистрации';
        ElNotification({
          title: 'Ошибка регистрации',
          message: this.errorMessage,
          type: 'error',
        });
      }
    },
    async getUserProfile() {
      try {
        const response = await api.get('/users/profile');
        this.user = response.data as User;
      } catch (error: any) {
        console.error(error);
        this.errorMessage =
          error?.response?.data?.message || 'Ошибка при загрузке профиля';
        ElNotification({
          title: 'Ошибка профиля',
          message: this.errorMessage,
          type: 'error',
        });
        this.logout();
      }
    },
    async updateUserProfile(details: UpdateUserProfile): Promise<void> {
      try {
        const response = await api.put('/users/profile', details);
        this.user = response.data as User;
        ElNotification({
          title: 'Успешно',
          message: 'Профиль обновлён',
          type: 'success',
        });
      } catch (error: any) {
        console.error(error);
        ElNotification({
          title: 'Ошибка обновления профиля',
          message:
            error?.response?.data?.message || 'Не удалось обновить профиль',
          type: 'error',
        });
        throw error;
      }
    },
    logout() {
      this.user = null;
      this.token = null;
      this.errorMessage = '';
      localStorage.removeItem('token');
      router.push('/login');
    },
  },
});
