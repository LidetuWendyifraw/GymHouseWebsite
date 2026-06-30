export type UserRole = 'member' | 'trainer' | 'admin';

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string;
  phone: string;
  avatar_url: string;
  date_of_birth: string | null;
  gender: string;
  height_cm: number;
  weight_kg: number;
  bmi: number;
  address: string;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  duration_minutes: number;
  price: number;
  category: string;
  icon: string;
  image_url: string;
  is_featured: boolean;
  created_at: string;
}

export interface Trainer {
  id: string;
  user_id: string | null;
  name: string;
  qualification: string;
  experience_years: number;
  specialty: string;
  bio: string;
  photo_url: string;
  rating: number;
  is_active: boolean;
  created_at: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  duration_days: number;
  benefits: string[];
  features: string[];
  is_popular: boolean;
  color: string;
  created_at: string;
}

export interface Membership {
  id: string;
  user_id: string;
  plan_id: string | null;
  plan?: MembershipPlan;
  start_date: string;
  end_date: string;
  status: 'active' | 'expired' | 'cancelled' | 'pending';
  payment_amount: number;
  created_at: string;
}

export interface FitnessClass {
  id: string;
  name: string;
  description: string;
  trainer_id: string | null;
  trainer?: Trainer;
  day_of_week: number;
  start_time: string;
  duration_minutes: number;
  capacity: number;
  image_url: string;
  created_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  booking_type: 'session' | 'trainer' | 'class';
  service_id: string | null;
  service?: Service;
  trainer_id: string | null;
  trainer?: Trainer;
  class_id: string | null;
  fitness_class?: FitnessClass;
  booking_date: string;
  start_time: string;
  duration_minutes: number;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'completed';
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  created_at: string;
}

export interface Testimonial {
  id: string;
  user_id: string | null;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar_url: string;
  is_featured: boolean;
  created_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: string;
  image_url: string;
  is_published: boolean;
  published_at: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

export interface Attendance {
  id: string;
  user_id: string;
  check_in: string;
  check_out: string | null;
  duration_minutes: number;
  created_at: string;
}

export interface ProgressLog {
  id: string;
  user_id: string;
  log_date: string;
  weight_kg: number | null;
  workouts_count: number;
  calories_burned: number;
  notes: string;
  created_at: string;
}
