/*
# Gym House - RLS Policies

Enables RLS on all tables and adds ownership/admin-scoped policies.
- Public read on services, trainers, membership_plans, fitness_classes, gallery, testimonials, announcements.
- Owner-scoped CRUD on profiles, memberships, bookings, notifications, attendance, progress_logs.
- Admin (profiles.role = 'admin') can manage all data.
*/

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainers ENABLE ROW LEVEL SECURITY;
ALTER TABLE membership_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE fitness_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_logs ENABLE ROW LEVEL SECURITY;

-- profiles policies
DROP POLICY IF EXISTS "profiles_select_own_or_public" ON profiles;
CREATE POLICY "profiles_select_own_or_public" ON profiles FOR SELECT
TO authenticated USING (auth.uid() = id OR is_admin() OR role = 'trainer');

DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT
TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE
TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_admin_update" ON profiles;
CREATE POLICY "profiles_admin_update" ON profiles FOR UPDATE
TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- services policies (public read, admin write)
DROP POLICY IF EXISTS "services_public_read" ON services;
CREATE POLICY "services_public_read" ON services FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "services_admin_insert" ON services;
CREATE POLICY "services_admin_insert" ON services FOR INSERT
TO authenticated WITH CHECK (is_admin());

DROP POLICY IF EXISTS "services_admin_update" ON services;
CREATE POLICY "services_admin_update" ON services FOR UPDATE
TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "services_admin_delete" ON services;
CREATE POLICY "services_admin_delete" ON services FOR DELETE
TO authenticated USING (is_admin());

-- trainers policies (public read, admin write)
DROP POLICY IF EXISTS "trainers_public_read" ON trainers;
CREATE POLICY "trainers_public_read" ON trainers FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "trainers_admin_insert" ON trainers;
CREATE POLICY "trainers_admin_insert" ON trainers FOR INSERT
TO authenticated WITH CHECK (is_admin());

DROP POLICY IF EXISTS "trainers_admin_update" ON trainers;
CREATE POLICY "trainers_admin_update" ON trainers FOR UPDATE
TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "trainers_admin_delete" ON trainers;
CREATE POLICY "trainers_admin_delete" ON trainers FOR DELETE
TO authenticated USING (is_admin());

-- membership_plans policies (public read, admin write)
DROP POLICY IF EXISTS "plans_public_read" ON membership_plans;
CREATE POLICY "plans_public_read" ON membership_plans FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "plans_admin_insert" ON membership_plans;
CREATE POLICY "plans_admin_insert" ON membership_plans FOR INSERT
TO authenticated WITH CHECK (is_admin());

DROP POLICY IF EXISTS "plans_admin_update" ON membership_plans;
CREATE POLICY "plans_admin_update" ON membership_plans FOR UPDATE
TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "plans_admin_delete" ON membership_plans;
CREATE POLICY "plans_admin_delete" ON membership_plans FOR DELETE
TO authenticated USING (is_admin());

-- memberships policies (owner + admin)
DROP POLICY IF EXISTS "memberships_select_own" ON memberships;
CREATE POLICY "memberships_select_own" ON memberships FOR SELECT
TO authenticated USING (auth.uid() = user_id OR is_admin());

DROP POLICY IF EXISTS "memberships_insert_own" ON memberships;
CREATE POLICY "memberships_insert_own" ON memberships FOR INSERT
TO authenticated WITH CHECK (auth.uid() = user_id OR is_admin());

DROP POLICY IF EXISTS "memberships_update_own" ON memberships;
CREATE POLICY "memberships_update_own" ON memberships FOR UPDATE
TO authenticated USING (auth.uid() = user_id OR is_admin()) WITH CHECK (auth.uid() = user_id OR is_admin());

DROP POLICY IF EXISTS "memberships_delete_own" ON memberships;
CREATE POLICY "memberships_delete_own" ON memberships FOR DELETE
TO authenticated USING (auth.uid() = user_id OR is_admin());

-- fitness_classes policies (public read, admin write)
DROP POLICY IF EXISTS "classes_public_read" ON fitness_classes;
CREATE POLICY "classes_public_read" ON fitness_classes FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "classes_admin_insert" ON fitness_classes;
CREATE POLICY "classes_admin_insert" ON fitness_classes FOR INSERT
TO authenticated WITH CHECK (is_admin());

DROP POLICY IF EXISTS "classes_admin_update" ON fitness_classes;
CREATE POLICY "classes_admin_update" ON fitness_classes FOR UPDATE
TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "classes_admin_delete" ON fitness_classes;
CREATE POLICY "classes_admin_delete" ON fitness_classes FOR DELETE
TO authenticated USING (is_admin());

-- bookings policies (owner + admin)
DROP POLICY IF EXISTS "bookings_select_own" ON bookings;
CREATE POLICY "bookings_select_own" ON bookings FOR SELECT
TO authenticated USING (auth.uid() = user_id OR is_admin());

DROP POLICY IF EXISTS "bookings_insert_own" ON bookings;
CREATE POLICY "bookings_insert_own" ON bookings FOR INSERT
TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "bookings_update_own" ON bookings;
CREATE POLICY "bookings_update_own" ON bookings FOR UPDATE
TO authenticated USING (auth.uid() = user_id OR is_admin()) WITH CHECK (auth.uid() = user_id OR is_admin());

DROP POLICY IF EXISTS "bookings_delete_own" ON bookings;
CREATE POLICY "bookings_delete_own" ON bookings FOR DELETE
TO authenticated USING (auth.uid() = user_id OR is_admin());

-- gallery policies (public read, admin write)
DROP POLICY IF EXISTS "gallery_public_read" ON gallery;
CREATE POLICY "gallery_public_read" ON gallery FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "gallery_admin_insert" ON gallery;
CREATE POLICY "gallery_admin_insert" ON gallery FOR INSERT
TO authenticated WITH CHECK (is_admin());

DROP POLICY IF EXISTS "gallery_admin_update" ON gallery;
CREATE POLICY "gallery_admin_update" ON gallery FOR UPDATE
TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "gallery_admin_delete" ON gallery;
CREATE POLICY "gallery_admin_delete" ON gallery FOR DELETE
TO authenticated USING (is_admin());

-- testimonials policies (public read, owner + admin write)
DROP POLICY IF EXISTS "testimonials_public_read" ON testimonials;
CREATE POLICY "testimonials_public_read" ON testimonials FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "testimonials_insert_own" ON testimonials;
CREATE POLICY "testimonials_insert_own" ON testimonials FOR INSERT
TO authenticated WITH CHECK (auth.uid() = user_id OR is_admin());

DROP POLICY IF EXISTS "testimonials_update_own" ON testimonials;
CREATE POLICY "testimonials_update_own" ON testimonials FOR UPDATE
TO authenticated USING (auth.uid() = user_id OR is_admin()) WITH CHECK (auth.uid() = user_id OR is_admin());

DROP POLICY IF EXISTS "testimonials_delete_own" ON testimonials;
CREATE POLICY "testimonials_delete_own" ON testimonials FOR DELETE
TO authenticated USING (auth.uid() = user_id OR is_admin());

-- announcements policies (public read published, admin write)
DROP POLICY IF EXISTS "announcements_public_read" ON announcements;
CREATE POLICY "announcements_public_read" ON announcements FOR SELECT
TO anon, authenticated USING (is_published = true OR is_admin());

DROP POLICY IF EXISTS "announcements_admin_insert" ON announcements;
CREATE POLICY "announcements_admin_insert" ON announcements FOR INSERT
TO authenticated WITH CHECK (is_admin());

DROP POLICY IF EXISTS "announcements_admin_update" ON announcements;
CREATE POLICY "announcements_admin_update" ON announcements FOR UPDATE
TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "announcements_admin_delete" ON announcements;
CREATE POLICY "announcements_admin_delete" ON announcements FOR DELETE
TO authenticated USING (is_admin());

-- notifications policies (owner + admin)
DROP POLICY IF EXISTS "notifications_select_own" ON notifications;
CREATE POLICY "notifications_select_own" ON notifications FOR SELECT
TO authenticated USING (auth.uid() = user_id OR is_admin());

DROP POLICY IF EXISTS "notifications_insert_own" ON notifications;
CREATE POLICY "notifications_insert_own" ON notifications FOR INSERT
TO authenticated WITH CHECK (auth.uid() = user_id OR is_admin());

DROP POLICY IF EXISTS "notifications_update_own" ON notifications;
CREATE POLICY "notifications_update_own" ON notifications FOR UPDATE
TO authenticated USING (auth.uid() = user_id OR is_admin()) WITH CHECK (auth.uid() = user_id OR is_admin());

DROP POLICY IF EXISTS "notifications_delete_own" ON notifications;
CREATE POLICY "notifications_delete_own" ON notifications FOR DELETE
TO authenticated USING (auth.uid() = user_id OR is_admin());

-- attendance policies (owner + admin)
DROP POLICY IF EXISTS "attendance_select_own" ON attendance;
CREATE POLICY "attendance_select_own" ON attendance FOR SELECT
TO authenticated USING (auth.uid() = user_id OR is_admin());

DROP POLICY IF EXISTS "attendance_insert_own" ON attendance;
CREATE POLICY "attendance_insert_own" ON attendance FOR INSERT
TO authenticated WITH CHECK (auth.uid() = user_id OR is_admin());

DROP POLICY IF EXISTS "attendance_update_own" ON attendance;
CREATE POLICY "attendance_update_own" ON attendance FOR UPDATE
TO authenticated USING (auth.uid() = user_id OR is_admin()) WITH CHECK (auth.uid() = user_id OR is_admin());

DROP POLICY IF EXISTS "attendance_delete_own" ON attendance;
CREATE POLICY "attendance_delete_own" ON attendance FOR DELETE
TO authenticated USING (auth.uid() = user_id OR is_admin());

-- progress_logs policies (owner only)
DROP POLICY IF EXISTS "progress_select_own" ON progress_logs;
CREATE POLICY "progress_select_own" ON progress_logs FOR SELECT
TO authenticated USING (auth.uid() = user_id OR is_admin());

DROP POLICY IF EXISTS "progress_insert_own" ON progress_logs;
CREATE POLICY "progress_insert_own" ON progress_logs FOR INSERT
TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "progress_update_own" ON progress_logs;
CREATE POLICY "progress_update_own" ON progress_logs FOR UPDATE
TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "progress_delete_own" ON progress_logs;
CREATE POLICY "progress_delete_own" ON progress_logs FOR DELETE
TO authenticated USING (auth.uid() = user_id);
