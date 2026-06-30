import { useEffect, useState } from 'react';
import {
  User, CreditCard, Calendar, Activity, Bell, TrendingUp, Settings,
  Plus, X, CheckCircle2, XCircle, Clock, AlertCircle, CalendarCheck,
  Dumbbell, Heart, Scale, Flame, Trash2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '../context/RouterContext';
import { supabase } from '../lib/supabase';
import { Membership, Booking, Notification, ProgressLog, Service, Trainer, FitnessClass, MembershipPlan } from '../types';

type Tab = 'overview' | 'profile' | 'membership' | 'bookings' | 'progress' | 'notifications';

export default function Dashboard() {
  const { user, profile, refreshProfile } = useAuth();
  const { navigate } = useRouter();
  const [tab, setTab] = useState<Tab>('overview');
  const [membership, setMembership] = useState<(Membership & { plan?: MembershipPlan }) | null>(null);
  const [bookings, setBookings] = useState<(Booking & { service?: Service; trainer?: Trainer; fitness_class?: FitnessClass })[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [progressLogs, setProgressLogs] = useState<ProgressLog[]>([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [editProfile, setEditProfile] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    const [mem, bk, notif, prog] = await Promise.all([
      supabase.from('memberships').select('*, plan:membership_plans(*)').eq('user_id', user.id).order('created_at', { ascending: false }).maybeSingle(),
      supabase.from('bookings').select('*, service:services(*), trainer:trainers(*), fitness_class:fitness_classes(*)').eq('user_id', user.id).order('booking_date', { ascending: false }),
      supabase.from('notifications').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('progress_logs').select('*').eq('user_id', user.id).order('log_date', { ascending: false }),
    ]);
    setMembership(mem.data as any);
    setBookings(bk.data as any ?? []);
    setNotifications(notif.data as Notification[] ?? []);
    setProgressLogs(prog.data as ProgressLog[] ?? []);
  };

  const tabs: { id: Tab; label: string; icon: typeof User }[] = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'membership', label: 'Membership', icon: CreditCard },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const activeBookings = bookings.filter((b) => b.status === 'pending' || b.status === 'approved');
  const membershipActive = membership && membership.status === 'active' && new Date(membership.end_date) >= new Date();

  const cancelBooking = async (id: string) => {
    await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', id);
    loadData();
  };

  const markNotifRead = async (id: string) => {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    loadData();
  };

  if (!user) return null;

  return (
    <div className="pt-20 min-h-screen bg-dark-950 animate-fade-in">
      <div className="container-max px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="lg:w-64 shrink-0">
            <div className="card p-5 mb-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center text-white text-lg font-bold">
                  {profile?.full_name?.charAt(0).toUpperCase() ?? 'U'}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-white truncate">{profile?.full_name ?? 'User'}</p>
                  <p className="text-xs text-dark-400 capitalize">{profile?.role}</p>
                </div>
              </div>
              <div className={`badge ${membershipActive ? 'bg-primary-600/20 text-primary-400' : 'bg-dark-800 text-dark-400'}`}>
                {membershipActive ? 'Active Member' : 'No Active Plan'}
              </div>
            </div>

            <nav className="card p-2">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    tab === t.id ? 'bg-primary-600 text-white' : 'text-dark-300 hover:bg-dark-800'
                  }`}
                >
                  <t.icon className="w-4 h-4" />
                  {t.label}
                  {t.id === 'notifications' && unreadCount > 0 && (
                    <span className="ml-auto w-5 h-5 bg-accent-500 text-dark-950 text-xs font-bold rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            {tab === 'overview' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {profile?.full_name?.split(' ')[0] ?? 'Member'}!</h1>
                  <p className="text-dark-400">Here's your fitness journey at a glance.</p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="card p-5">
                    <div className="flex items-center justify-between mb-2">
                      <CreditCard className="w-8 h-8 text-primary-500" />
                      <span className={`badge ${membershipActive ? 'bg-primary-600/20 text-primary-400' : 'bg-dark-800 text-dark-400'}`}>
                        {membershipActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-white">{membership?.plan?.name ?? 'No Plan'}</p>
                    <p className="text-xs text-dark-400 mt-1">
                      {membershipActive ? `Expires ${new Date(membership!.end_date).toLocaleDateString()}` : 'Choose a plan'}
                    </p>
                  </div>

                  <div className="card p-5">
                    <div className="flex items-center justify-between mb-2">
                      <CalendarCheck className="w-8 h-8 text-accent-500" />
                    </div>
                    <p className="text-2xl font-bold text-white">{activeBookings.length}</p>
                    <p className="text-xs text-dark-400 mt-1">Active Bookings</p>
                  </div>

                  <div className="card p-5">
                    <div className="flex items-center justify-between mb-2">
                      <Scale className="w-8 h-8 text-primary-500" />
                    </div>
                    <p className="text-2xl font-bold text-white">{profile?.bmi?.toFixed(1) ?? '—'}</p>
                    <p className="text-xs text-dark-400 mt-1">BMI Score</p>
                  </div>

                  <div className="card p-5">
                    <div className="flex items-center justify-between mb-2">
                      <Bell className="w-8 h-8 text-accent-500" />
                    </div>
                    <p className="text-2xl font-bold text-white">{unreadCount}</p>
                    <p className="text-xs text-dark-400 mt-1">Unread Notifications</p>
                  </div>
                </div>

                <div className="card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white">Upcoming Bookings</h2>
                    <button onClick={() => setShowBookingModal(true)} className="btn-primary text-sm">
                      <Plus className="w-4 h-4" /> New Booking
                    </button>
                  </div>
                  {activeBookings.length === 0 ? (
                    <p className="text-dark-400 text-sm py-8 text-center">No upcoming bookings. Book a session to get started!</p>
                  ) : (
                    <div className="space-y-3">
                      {activeBookings.slice(0, 3).map((b) => (
                        <div key={b.id} className="flex items-center justify-between p-3 bg-dark-800/50 rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-white">
                              {b.booking_type === 'trainer' ? b.trainer?.name : b.booking_type === 'class' ? b.fitness_class?.name : b.service?.name ?? 'Session'}
                            </p>
                            <p className="text-xs text-dark-400">{new Date(b.booking_date).toLocaleDateString()} at {b.start_time.slice(0, 5)}</p>
                          </div>
                          <span className={`badge capitalize ${
                            b.status === 'approved' ? 'bg-primary-600/20 text-primary-400' : 'bg-accent-500/20 text-accent-400'
                          }`}>{b.status}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {tab === 'profile' && (
              <ProfileTab profile={profile} user={user} editMode={editProfile} setEditMode={setEditProfile} onSaved={async () => { await refreshProfile(); setEditMode(false); }} />
            )}

            {tab === 'membership' && (
              <div className="animate-fade-in">
                <h1 className="text-2xl font-bold text-white mb-6">Membership Status</h1>
                {membership ? (
                  <div className="card p-6">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h2 className="text-xl font-bold text-white">{membership.plan?.name ?? 'Membership'}</h2>
                        <p className="text-dark-400 text-sm mt-1">Member since {new Date(membership.start_date).toLocaleDateString()}</p>
                      </div>
                      <span className={`badge ${membershipActive ? 'bg-primary-600/20 text-primary-400' : 'bg-red-500/20 text-red-400'}`}>
                        {membership.status}
                      </span>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4 mb-6">
                      <div className="p-4 bg-dark-800/50 rounded-lg">
                        <p className="text-xs text-dark-400 mb-1">Start Date</p>
                        <p className="text-white font-medium">{new Date(membership.start_date).toLocaleDateString()}</p>
                      </div>
                      <div className="p-4 bg-dark-800/50 rounded-lg">
                        <p className="text-xs text-dark-400 mb-1">End Date</p>
                        <p className="text-white font-medium">{new Date(membership.end_date).toLocaleDateString()}</p>
                      </div>
                      <div className="p-4 bg-dark-800/50 rounded-lg">
                        <p className="text-xs text-dark-400 mb-1">Amount Paid</p>
                        <p className="text-white font-medium">${membership.payment_amount}</p>
                      </div>
                    </div>
                    {membership.plan && (
                      <div>
                        <p className="text-sm text-dark-300 mb-2">Benefits included:</p>
                        <ul className="grid sm:grid-cols-2 gap-2">
                          {membership.plan.benefits.map((b, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-dark-200">
                              <CheckCircle2 className="w-4 h-4 text-primary-500" /> {b}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <button onClick={() => navigate('/membership')} className="btn-secondary mt-6 text-sm">
                      Upgrade Plan
                    </button>
                  </div>
                ) : (
                  <div className="card p-8 text-center">
                    <CreditCard className="w-12 h-12 text-dark-600 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-white mb-2">No Active Membership</h2>
                    <p className="text-dark-400 mb-6">Choose a membership plan to start your fitness journey.</p>
                    <button onClick={() => navigate('/membership')} className="btn-primary">View Plans</button>
                  </div>
                )}
              </div>
            )}

            {tab === 'bookings' && (
              <div className="animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-2xl font-bold text-white">My Bookings</h1>
                  <button onClick={() => setShowBookingModal(true)} className="btn-primary text-sm">
                    <Plus className="w-4 h-4" /> New Booking
                  </button>
                </div>
                {bookings.length === 0 ? (
                  <div className="card p-8 text-center">
                    <Calendar className="w-12 h-12 text-dark-600 mx-auto mb-4" />
                    <p className="text-dark-400 mb-4">No bookings yet. Book a session to get started!</p>
                    <button onClick={() => setShowBookingModal(true)} className="btn-primary">Book a Session</button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {bookings.map((b) => (
                      <div key={b.id} className="card p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-primary-600/20 flex items-center justify-center shrink-0">
                            {b.booking_type === 'trainer' ? <User className="w-6 h-6 text-primary-400" /> : b.booking_type === 'class' ? <Users className="w-6 h-6 text-primary-400" /> : <Dumbbell className="w-6 h-6 text-primary-400" />}
                          </div>
                          <div>
                            <p className="font-medium text-white">
                              {b.booking_type === 'trainer' ? b.trainer?.name : b.booking_type === 'class' ? b.fitness_class?.name : b.service?.name ?? 'Session'}
                            </p>
                            <p className="text-xs text-dark-400 capitalize">{b.booking_type} • {new Date(b.booking_date).toLocaleDateString()} at {b.start_time.slice(0, 5)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`badge capitalize ${
                            b.status === 'approved' ? 'bg-primary-600/20 text-primary-400' :
                            b.status === 'pending' ? 'bg-accent-500/20 text-accent-400' :
                            b.status === 'cancelled' || b.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                            'bg-dark-800 text-dark-400'
                          }`}>{b.status}</span>
                          {(b.status === 'pending' || b.status === 'approved') && (
                            <button onClick={() => cancelBooking(b.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === 'progress' && (
              <ProgressTab userId={user.id} logs={progressLogs} onUpdate={loadData} />
            )}

            {tab === 'notifications' && (
              <div className="animate-fade-in">
                <h1 className="text-2xl font-bold text-white mb-6">Notifications</h1>
                {notifications.length === 0 ? (
                  <div className="card p-8 text-center">
                    <Bell className="w-12 h-12 text-dark-600 mx-auto mb-4" />
                    <p className="text-dark-400">No notifications yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {notifications.map((n) => (
                      <div key={n.id} className={`card p-4 flex items-start justify-between ${!n.is_read ? 'border-primary-700' : ''}`}>
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary-600/20 flex items-center justify-center shrink-0">
                            <Bell className="w-5 h-5 text-primary-400" />
                          </div>
                          <div>
                            <p className="font-medium text-white">{n.title}</p>
                            <p className="text-sm text-dark-400 mt-1">{n.message}</p>
                            <p className="text-xs text-dark-500 mt-1">{new Date(n.created_at).toLocaleString()}</p>
                          </div>
                        </div>
                        {!n.is_read && (
                          <button onClick={() => markNotifRead(n.id)} className="text-xs text-primary-400 hover:text-primary-300 shrink-0">Mark read</button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      {showBookingModal && <BookingModal onClose={() => setShowBookingModal(false)} onBooked={loadData} userId={user.id} />}
    </div>
  );
}

function ProfileTab({ profile, user, editMode, setEditMode, onSaved }: any) {
  const [form, setForm] = useState({
    full_name: profile?.full_name ?? '',
    phone: profile?.phone ?? '',
    date_of_birth: profile?.date_of_birth ?? '',
    gender: profile?.gender ?? '',
    height_cm: profile?.height_cm ?? 0,
    weight_kg: profile?.weight_kg ?? 0,
    address: profile?.address ?? '',
  });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    const bmi = form.height_cm > 0 ? (form.weight_kg / Math.pow(form.height_cm / 100, 2)) : 0;
    await supabase.from('profiles').update({ ...form, bmi, updated_at: new Date().toISOString() }).eq('id', user.id);
    setSaving(false);
    onSaved();
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">My Profile</h1>
        <button onClick={() => setEditMode(!editMode)} className="btn-secondary text-sm">
          <Settings className="w-4 h-4" /> {editMode ? 'Cancel' : 'Edit'}
        </button>
      </div>

      <div className="card p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-primary-600 flex items-center justify-center text-white text-2xl font-bold">
            {profile?.full_name?.charAt(0).toUpperCase() ?? 'U'}
          </div>
          <div>
            <p className="text-xl font-bold text-white">{profile?.full_name}</p>
            <p className="text-sm text-dark-400">{user?.email}</p>
            <span className="badge bg-primary-600/20 text-primary-400 capitalize mt-1">{profile?.role}</span>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-dark-300 mb-1.5">Full Name</label>
            <input disabled={!editMode} value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="input-field disabled:opacity-60" />
          </div>
          <div>
            <label className="block text-sm text-dark-300 mb-1.5">Phone</label>
            <input disabled={!editMode} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field disabled:opacity-60" />
          </div>
          <div>
            <label className="block text-sm text-dark-300 mb-1.5">Date of Birth</label>
            <input type="date" disabled={!editMode} value={form.date_of_birth} onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })} className="input-field disabled:opacity-60" />
          </div>
          <div>
            <label className="block text-sm text-dark-300 mb-1.5">Gender</label>
            <select disabled={!editMode} value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="input-field disabled:opacity-60">
              <option value="">Prefer not to say</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-dark-300 mb-1.5">Height (cm)</label>
            <input type="number" disabled={!editMode} value={form.height_cm} onChange={(e) => setForm({ ...form, height_cm: parseFloat(e.target.value) || 0 })} className="input-field disabled:opacity-60" />
          </div>
          <div>
            <label className="block text-sm text-dark-300 mb-1.5">Weight (kg)</label>
            <input type="number" disabled={!editMode} value={form.weight_kg} onChange={(e) => setForm({ ...form, weight_kg: parseFloat(e.target.value) || 0 })} className="input-field disabled:opacity-60" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm text-dark-300 mb-1.5">Address</label>
            <input disabled={!editMode} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="input-field disabled:opacity-60" />
          </div>
        </div>

        {editMode && (
          <button onClick={save} disabled={saving} className="btn-primary mt-6 disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        )}

        {profile?.bmi > 0 && (
          <div className="mt-6 p-4 bg-dark-800/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-dark-300">Your BMI</span>
              <span className="text-lg font-bold text-white">{profile.bmi.toFixed(1)}</span>
            </div>
            <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${profile.bmi < 18.5 ? 'bg-blue-500' : profile.bmi < 25 ? 'bg-primary-500' : profile.bmi < 30 ? 'bg-accent-500' : 'bg-red-500'}`} style={{ width: `${Math.min(profile.bmi / 40 * 100, 100)}%` }} />
            </div>
            <p className="text-xs text-dark-400 mt-2">
              {profile.bmi < 18.5 ? 'Underweight' : profile.bmi < 25 ? 'Healthy weight' : profile.bmi < 30 ? 'Overweight' : 'Obese'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function ProgressTab({ userId, logs, onUpdate }: { userId: string; logs: ProgressLog[]; onUpdate: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ weight_kg: '', workouts_count: '', calories_burned: '', notes: '' });

  const addLog = async () => {
    await supabase.from('progress_logs').insert({
      user_id: userId,
      weight_kg: parseFloat(form.weight_kg) || null,
      workouts_count: parseInt(form.workouts_count) || 0,
      calories_burned: parseInt(form.calories_burned) || 0,
      notes: form.notes,
    });
    setForm({ weight_kg: '', workouts_count: '', calories_burned: '', notes: '' });
    setShowForm(false);
    onUpdate();
  };

  const deleteLog = async (id: string) => {
    await supabase.from('progress_logs').delete().eq('id', id);
    onUpdate();
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Progress Tracking</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm">
          <Plus className="w-4 h-4" /> Add Entry
        </button>
      </div>

      {showForm && (
        <div className="card p-6 mb-6 animate-slide-down">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-dark-300 mb-1.5">Weight (kg)</label>
              <input type="number" step="0.1" value={form.weight_kg} onChange={(e) => setForm({ ...form, weight_kg: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm text-dark-300 mb-1.5">Workouts This Week</label>
              <input type="number" value={form.workouts_count} onChange={(e) => setForm({ ...form, workouts_count: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm text-dark-300 mb-1.5">Calories Burned</label>
              <input type="number" value={form.calories_burned} onChange={(e) => setForm({ ...form, calories_burned: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm text-dark-300 mb-1.5">Notes</label>
              <input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input-field" />
            </div>
          </div>
          <button onClick={addLog} className="btn-primary mt-4 text-sm">Save Entry</button>
        </div>
      )}

      {logs.length === 0 ? (
        <div className="card p-8 text-center">
          <TrendingUp className="w-12 h-12 text-dark-600 mx-auto mb-4" />
          <p className="text-dark-400">No progress logs yet. Start tracking your fitness journey!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {logs.map((log) => (
            <div key={log.id} className="card p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-white">{new Date(log.log_date).toLocaleDateString()}</p>
                  <div className="flex gap-4 mt-2">
                    {log.weight_kg && (
                      <span className="flex items-center gap-1 text-sm text-dark-300">
                        <Scale className="w-4 h-4 text-primary-500" /> {log.weight_kg} kg
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-sm text-dark-300">
                      <Dumbbell className="w-4 h-4 text-primary-500" /> {log.workouts_count} workouts
                    </span>
                    <span className="flex items-center gap-1 text-sm text-dark-300">
                      <Flame className="w-4 h-4 text-accent-500" /> {log.calories_burned} cal
                    </span>
                  </div>
                  {log.notes && <p className="text-sm text-dark-400 mt-2">{log.notes}</p>}
                </div>
                <button onClick={() => deleteLog(log.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BookingModal({ onClose, onBooked, userId }: { onClose: () => void; onBooked: () => void; userId: string }) {
  const [type, setType] = useState<'session' | 'trainer' | 'class'>('session');
  const [services, setServices] = useState<Service[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [classes, setClasses] = useState<FitnessClass[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('09:00');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      supabase.from('services').select('*'),
      supabase.from('trainers').select('*').eq('is_active', true),
      supabase.from('fitness_classes').select('*, trainer:trainers(*)'),
    ]).then(([s, t, c]) => {
      setServices(s.data as Service[] ?? []);
      setTrainers(t.data as Trainer[] ?? []);
      setClasses(c.data as FitnessClass[] ?? []);
    });
  }, []);

  const submit = async () => {
    if (!selectedId || !date) return;
    setLoading(true);
    const payload: any = {
      user_id: userId,
      booking_type: type,
      booking_date: date,
      start_time: time,
      status: 'pending',
    };
    if (type === 'session') payload.service_id = selectedId;
    if (type === 'trainer') payload.trainer_id = selectedId;
    if (type === 'class') payload.class_id = selectedId;

    await supabase.from('bookings').insert(payload);
    await supabase.from('notifications').insert({
      user_id: userId,
      title: 'Booking Created',
      message: `Your ${type} booking for ${new Date(date).toLocaleDateString()} at ${time} is pending approval.`,
      type: 'booking',
    });
    setLoading(false);
    onBooked();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-dark-950/90 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="card p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">New Booking</h2>
          <button onClick={onClose} className="text-dark-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-dark-300 mb-2">Booking Type</label>
            <div className="grid grid-cols-3 gap-2">
              {(['session', 'trainer', 'class'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => { setType(t); setSelectedId(''); }}
                  className={`p-3 rounded-lg text-sm font-medium capitalize transition-all ${
                    type === t ? 'bg-primary-600 text-white' : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
                  }`}
                >
                  {t === 'session' ? 'Service' : t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-dark-300 mb-1.5">
              {type === 'session' ? 'Select Service' : type === 'trainer' ? 'Select Trainer' : 'Select Class'}
            </label>
            <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)} className="input-field">
              <option value="">Choose...</option>
              {type === 'session' && services.map((s) => <option key={s.id} value={s.id}>{s.name} - ${s.price}</option>)}
              {type === 'trainer' && trainers.map((t) => <option key={t.id} value={t.id}>{t.name} - {t.specialty}</option>)}
              {type === 'class' && classes.map((c) => <option key={c.id} value={c.id}>{c.name} - {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][c.day_of_week]} {c.start_time.slice(0,5)}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-dark-300 mb-1.5">Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className="input-field" />
            </div>
            <div>
              <label className="block text-sm text-dark-300 mb-1.5">Time</label>
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="input-field" />
            </div>
          </div>

          <button onClick={submit} disabled={!selectedId || !date || loading} className="btn-primary w-full disabled:opacity-50">
            {loading ? 'Booking...' : 'Confirm Booking'}
          </button>
        </div>
      </div>
    </div>
  );
}
