/*
# Gym House - Core Schema (Part 1: Tables)

Creates all tables for the Gym House platform. Policies are added in a
follow-up migration once the is_admin() helper exists.

## Tables
1. profiles, 2. services, 3. trainers, 4. membership_plans, 5. memberships,
6. fitness_classes, 7. bookings, 8. gallery, 9. testimonials,
10. announcements, 11. notifications, 12. attendance, 13. progress_logs
*/

-- 1. profiles
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'trainer', 'admin')),
  full_name text NOT NULL DEFAULT '',
  phone text DEFAULT '',
  avatar_url text DEFAULT '',
  date_of_birth date,
  gender text DEFAULT '',
  height_cm numeric DEFAULT 0,
  weight_kg numeric DEFAULT 0,
  bmi numeric DEFAULT 0,
  address text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- 2. services
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  duration_minutes int DEFAULT 60,
  price numeric DEFAULT 0,
  category text DEFAULT '',
  icon text DEFAULT '',
  image_url text DEFAULT '',
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- 3. trainers
CREATE TABLE IF NOT EXISTS trainers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  name text NOT NULL,
  qualification text DEFAULT '',
  experience_years int DEFAULT 0,
  specialty text DEFAULT '',
  bio text DEFAULT '',
  photo_url text DEFAULT '',
  rating numeric DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- 4. membership_plans
CREATE TABLE IF NOT EXISTS membership_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  price numeric NOT NULL DEFAULT 0,
  duration_days int NOT NULL DEFAULT 30,
  benefits text[] DEFAULT '{}',
  features text[] DEFAULT '{}',
  is_popular boolean DEFAULT false,
  color text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- 5. memberships
CREATE TABLE IF NOT EXISTS memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id uuid REFERENCES membership_plans(id) ON DELETE SET NULL,
  start_date date NOT NULL DEFAULT CURRENT_DATE,
  end_date date NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled', 'pending')),
  payment_amount numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- 6. fitness_classes
CREATE TABLE IF NOT EXISTS fitness_classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  trainer_id uuid REFERENCES trainers(id) ON DELETE SET NULL,
  day_of_week int NOT NULL DEFAULT 1 CHECK (day_of_week BETWEEN 0 AND 6),
  start_time time NOT NULL DEFAULT '09:00',
  duration_minutes int DEFAULT 60,
  capacity int DEFAULT 20,
  image_url text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- 7. bookings
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  booking_type text NOT NULL CHECK (booking_type IN ('session', 'trainer', 'class')),
  service_id uuid REFERENCES services(id) ON DELETE SET NULL,
  trainer_id uuid REFERENCES trainers(id) ON DELETE SET NULL,
  class_id uuid REFERENCES fitness_classes(id) ON DELETE SET NULL,
  booking_date date NOT NULL,
  start_time time NOT NULL DEFAULT '09:00',
  duration_minutes int DEFAULT 60,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled', 'completed')),
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 8. gallery
CREATE TABLE IF NOT EXISTS gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  image_url text NOT NULL,
  category text DEFAULT 'facility',
  created_at timestamptz DEFAULT now()
);

-- 9. testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  name text NOT NULL,
  role text DEFAULT 'Member',
  content text NOT NULL,
  rating int DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  avatar_url text DEFAULT '',
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- 10. announcements
CREATE TABLE IF NOT EXISTS announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  category text DEFAULT 'news',
  image_url text DEFAULT '',
  is_published boolean DEFAULT true,
  published_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- 11. notifications
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text DEFAULT 'general',
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- 12. attendance
CREATE TABLE IF NOT EXISTS attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  check_in timestamp NOT NULL DEFAULT now(),
  check_out timestamp,
  duration_minutes int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- 13. progress_logs
CREATE TABLE IF NOT EXISTS progress_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  log_date date NOT NULL DEFAULT CURRENT_DATE,
  weight_kg numeric,
  workouts_count int DEFAULT 0,
  calories_burned int DEFAULT 0,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_memberships_user_id ON memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_attendance_user_id ON attendance(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_user_id ON progress_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
