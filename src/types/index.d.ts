// src/types/index.d.ts

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'super_admin' | 'gym_admin' | 'trainer' | 'user';
}

export interface Trainer {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'trainer';
  specialization: string; // Добавляем это свойство
  // Другие свойства, если есть
}

export interface TrainerDetails {
  id: number;
  user_id: number;
  specialization: string;
  experience_years: number;
  bio: string;
  certifications: string;
  photo_url: string;
}

export interface TrainingSession {
  id: number;
  user_id: number;
  trainer_id: number;
  gym_id: number;
  date: string; // ISO date string
  training_type: string;
  comments: string;
  trainer_name?: string;
}

export interface Workout {
  id: number;
  name: string;
  description: string;
  exercises: Exercise[];
  trainerId: number; // Добавляем это свойство
  trainerName?: string; // Если используете
}
export interface Exercise {
  id: number;
  name: string;
  sets: number;
  reps: number;
  weight: number;
}
export interface WorkingHour {
  id?: number;
  trainer_id: number;
  day_of_week: string;
  specific_date?: string | null;
  start_time: string;
  end_time: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface ProgressEntry {
  date: string; // ISO date string
  value: number; // Добавляем свойство value
  weight: number;
  bodyFatPercentage: number;
  muscleMass: number;
}

export interface Membership {
  id: number;
  user_id: number;
  gym_id: number;
  start_date: string; // ISO date string
  end_date: string; // ISO date string
  sessions_included: number;
  sessions_used: number;
}

export interface Subscription {
  id: number;
  user_id: number;
  gym_id: number;
  start_date: string; // ISO date string
  end_date: string; // ISO date string
  type: string;
  price: number;
}

export interface Payment {
  id: number;
  user_id: number;
  gym_id: number;
  amount: number;
  payment_method: string;
  payment_date: string; // ISO date string
}

export interface BookedSession {
  id: number;
  user_id: number;
  trainer_id: number;
  gym_id: number;
  session_id: number;
  date: string; // ISO date string
  status: 'booked' | 'completed' | 'canceled';
}

export interface Gym {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  errorMessage: string;
}

export interface TrainerStoreState {
  trainerDetails: TrainerDetails | null;
}

export interface EditForm {
  name: string;
  email: string;
  phone: string;
  password?: string;
  specialization?: string;
  experience_years?: number;
  bio?: string;
  certifications?: string;
  photo_url?: string;
}
export interface UpdateUserProfile {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
}

export interface UpdateTrainerDetails {
  specialization?: string;
  experience_years?: number;
  bio?: string;
  certifications?: string;
  photo_url?: string;
}

export interface ProfileEditForm extends Partial<User> {
  password?: string;
}
export interface TrainerEditForm extends Partial<TrainerDetails> {}

export interface SessionStoreState {
  upcomingSessions: TrainingSession[];
  availableSessions: TrainingSession[];
  completedSessions: TrainingSession[];
}

export interface MembershipStoreState {
  membership: Membership | null;
}

export interface ProgressStoreState {
  progressEntries: ProgressEntry[];
}

export interface SubscriptionStoreState {
  subscription: Subscription | null;
}

export interface WorkoutStoreState {
  workouts: Workout[];
  trainers: Trainer[];
}
