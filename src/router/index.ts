// src/router/index.ts
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/store/useAuthStore';

// Импортируем лейаут
import MainLayout from '@/layouts/MainLayout.vue';
import AuthLayout from '@/layouts/AuthLayout.vue';
const routes: Array<RouteRecordRaw> = [
  { path: '/', redirect: '/login' },
  {
    path: '/',
    component: AuthLayout, // Используем AuthLayout как обёртку для публичных страниц
    children: [
      {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/LoginView.vue'),
      },
      {
        path: '/register',
        name: 'Register',
        component: () => import('@/views/RegisterView.vue'),
      },
    ],
  },

  {
    path: '/dashboard',
    component: MainLayout, // Используем MainLayout как обёртку
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/views/DashboardView.vue'),
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/ProfileView.vue'),
      },
      {
        path: 'workouts',
        name: 'Workouts',
        component: () => import('@/views/WorkoutsView.vue'),
        meta: { allowedRoles: ['user', 'trainer'] },
      },
      {
        path: 'progress',
        name: 'Progress',
        component: () => import('@/views/ProgressView.vue'),
        meta: { allowedRoles: ['user', 'trainer'] },
      },
      {
        path: 'subscription',
        name: 'Subscription',
        component: () => import('@/views/SubscriptionView.vue'),
        meta: { allowedRoles: ['user'] },
      },

      {
        path: 'trainer-schedule',
        name: 'TrainerSchedule',
        component: () => import('@/views/TrainerScheduleView.vue'),
        meta: { allowedRoles: ['trainer'] },
      },

      {
        path: 'gyms',
        name: 'Gyms',
        component: () => import('@/views/GymsView.vue'),
        meta: { allowedRoles: ['super_admin'] },
      },

      {
        path: 'trainers',
        name: 'Trainers',
        component: () => import('@/views/TrainersView.vue'),
        meta: { allowedRoles: ['super_admin', 'gym_admin', 'trainer'] },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = !!authStore.token;

  if (to.meta.requiresAuth) {
    if (!isAuthenticated) {
      return next('/login');
    }
    if (!authStore.user) {
      try {
        await authStore.getUserProfile();
      } catch (error) {
        console.error(error);
        return next('/login');
      }
      if (!authStore.user) {
        return next('/login');
      }
    }

    if (to.meta.allowedRoles && authStore.user) {
      const allowedRoles = to.meta.allowedRoles as string[];
      if (!allowedRoles.includes(authStore.user.role)) {
        return next('/dashboard');
      }
    }
  }

  next();
});

export default router;
