// src/types/index.d.ts

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'super_admin' | 'gym_admin' | 'trainer' | 'user';
  created_at?: string;
  updated_at?: string;
}

export interface Gym {
  id?: number;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
}

export interface Trainer {
  user_id?: number;
  name?: string; // Сделаем необязательными, так как при редактировании они не нужны
  email?: string;
  phone?: string;
  specialization: string;
  experience_years?: number;
  bio?: string;
  certifications?: string;
  photo_url?: string;
  role: 'trainer';
}

export interface WorkingHour {
  working_hour_id: number;
  id: number;
  trainer_id: number;
  day_of_week: string;
  specific_date?: string | null;
  start_time: string;
  end_time: string;
  status: 'available' | 'booked';
  sessions?: any; // Можно уточнить тип, если известен
}

export interface TrainingSession {
  session_id: number;
  status: 'booked' | 'completed' | 'canceled';
  specific_date?: string;
  start_time?: string;
  end_time?: string;
  trainer_name?: string;
  training_type?: string;
  comments?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  errorMessage: string;
  clients: User[]; // Добавлено для хранения клиентов
  meta: Meta;
}

export interface Meta {
  total: number;
  page: number;
  limit: number;
}

export interface UiState {
  isLoading: boolean;
}
