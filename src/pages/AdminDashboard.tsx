import { useEffect, useState } from 'react';
import {
  Users, Calendar, CreditCard, Settings, Bell, LayoutDashboard,
  Dumbbell, UserCheck, TrendingUp, CheckCircle2, XCircle, Clock,
  Plus, Trash2, Edit, X, Award, Image, Megaphone, Search,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '../context/RouterContext';
import { supabase } from '../lib/supabase';
import { Profile, Booking, Service, Trainer, MembershipPlan, Announcement, Membership } from '../types';

type Tab = 'overview' | 'members' | 'bookings' | 'trainers' | 'services' | 'plans' | 'announcements' | 'gallery';

export default function AdminDashboard() {
  const { user, profile } = useAuth();
  const { navigate } = useRouter();
  const [tab, setTab] = useState<Tab>('overview');
  const [members, setMembers] = useState<Profile[]>([]);
  const [bookings, setBookings] = useState<(Booking & { service?: Service; trainer?: Trainer; fitness_class?: any })[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [memberships, setMemberships] = useState<(Membership & { plan?: MembershipPlan })[]>([]);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    if (profile && profile.role !== 'admin') { navigate('/dashboard'); return; }
    if (profile?.role === 'admin') loadData();
  }, [user, profile]);

  const loadData = async () => {
    const [m, b, t, s, p, a, ms] = await Promise.all([
      supabase.from('profiles').select('*').order('created_at', { ascending: false }),
      supabase.from('bookings').select('*, service:services(*), trainer:trainers(*), fitness_class:fitness_classes(*)').order('created_at', { ascending: false }),
      supabase.from('trainers').select('*').order('created_at', { ascending: false }),
      supabase.from('services').select('*').order('name'),
      supabase.from('membership_plans').select('*').order('price'),
      supabase.from('announcements').select('*').order('created_at', { ascending: false }),
      supabase.from('memberships').select('*, plan:membership_plans(*)').order('created_at', { ascending: false }),
    ]);
    setMembers(m.data as Profile[] ?? []);
    setBookings(b.data as any ?? []);
    setTrainers(t.data as Trainer[] ?? []);
    setServices(s.data as Service[] ?? []);
    setPlans(p.data as MembershipPlan[] ?? []);
    setAnnouncements(a.data as Announcement[] ?? []);
    setMemberships(ms.data as any ?? []);
  };

  const tabs: { id: Tab; label: string; icon: typeof Users }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'trainers', label: 'Trainers', icon: UserCheck },
    { id: 'services', label: 'Services', icon: Dumbbell },
    { id: 'plans', label: 'Plans', icon: CreditCard },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
    { id: 'gallery', label: 'Gallery', icon: Image },
  ];

  const updateBookingStatus = async (id: string, status: Booking['status']) => {
    await supabase.from('bookings').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
    const booking = bookings.find((b) => b.id === id);
    if (booking) {
      await supabase.from('notifications').insert({
        user_id: booking.user_id,
        title: `Booking ${status}`,
        message: `Your booking for ${new Date(booking.booking_date).toLocaleDateString()} has been ${status}.`,
        type: 'booking',
      });
    }
    loadData();
  };

  if (!user || profile?.role !== 'admin') return null;

  const pendingBookings = bookings.filter((b) => b.status === 'pending');
  const activeMembers = memberships.filter((m) => m.status === 'active' && new Date(m.end_date) >= new Date());

  return (
    <div className="pt-20 min-h-screen bg-dark-950 animate-fade-in">
      <div className="container-max px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="lg:w-60 shrink-0">
            <div className="card p-4 mb-4">
              <p className="text-sm text-dark-400">Admin Panel</p>
              <p className="font-bold text-white">{profile?.full_name}</p>
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
                  {t.id === 'bookings' && pendingBookings.length > 0 && (
                    <span className="ml-auto w-5 h-5 bg-accent-500 text-dark-950 text-xs font-bold rounded-full flex items-center justify-center">
                      {pendingBookings.length}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </aside>

          <main className="flex-1 min-w-0">
            {tab === 'overview' && (
              <div className="space-y-6 animate-fade-in">
                <h1 className="text-3xl font-bold text-white">Admin Overview</h1>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard icon={Users} value={members.length} label="Total Members" color="primary" />
                  <StatCard icon={UserCheck} value={activeMembers.length} label="Active Members" color="primary" />
                  <StatCard icon={Calendar} value={pendingBookings.length} label="Pending Bookings" color="accent" />
                  <StatCard icon={Award} value={trainers.length} label="Trainers" color="primary" />
                </div>

                <div className="card p-6">
                  <h2 className="text-xl font-bold text-white mb-4">Recent Bookings</h2>
                  <div className="space-y-2">
                    {bookings.slice(0, 5).map((b) => (
                      <div key={b.id} className="flex items-center justify-between p-3 bg-dark-800/50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-white">
                            {b.booking_type === 'trainer' ? b.trainer?.name : b.booking_type === 'class' ? b.fitness_class?.name : b.service?.name ?? 'Session'}
                          </p>
                          <p className="text-xs text-dark-400">{new Date(b.booking_date).toLocaleDateString()} at {b.start_time.slice(0, 5)}</p>
                        </div>
                        <span className={`badge capitalize ${
                          b.status === 'approved' ? 'bg-primary-600/20 text-primary-400' :
                          b.status === 'pending' ? 'bg-accent-500/20 text-accent-400' :
                          b.status === 'cancelled' || b.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                          'bg-dark-700 text-dark-400'
                        }`}>{b.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {tab === 'members' && <MembersTab members={members} memberships={memberships} onUpdate={loadData} />}
            {tab === 'bookings' && <BookingsTab bookings={bookings} onUpdate={updateBookingStatus} />}
            {tab === 'trainers' && <TrainersTab trainers={trainers} onUpdate={loadData} />}
            {tab === 'services' && <ServicesTab services={services} onUpdate={loadData} />}
            {tab === 'plans' && <PlansTab plans={plans} onUpdate={loadData} />}
            {tab === 'announcements' && <AnnouncementsTab announcements={announcements} onUpdate={loadData} />}
            {tab === 'gallery' && <GalleryTab onUpdate={loadData} />}
          </main>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, value, label, color }: any) {
  return (
    <div className="card p-5">
      <div className={`w-10 h-10 rounded-lg bg-${color}-600/20 flex items-center justify-center mb-3`}>
        <Icon className={`w-5 h-5 text-${color}-400`} />
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-dark-400 mt-1">{label}</p>
    </div>
  );
}

function MembersTab({ members, memberships, onUpdate }: { members: Profile[]; memberships: any[]; onUpdate: () => void }) {
  const [search, setSearch] = useState('');
  const filtered = members.filter((m) => m.full_name.toLowerCase().includes(search.toLowerCase()) || m.id.includes(search));

  const updateRole = async (id: string, role: string) => {
    await supabase.from('profiles').update({ role }).eq('id', id);
    onUpdate();
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-white mb-6">Manage Members</h1>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-11" placeholder="Search members..." />
      </div>
      <div className="space-y-2">
        {filtered.map((m) => {
          const mem = memberships.find((ms) => ms.user_id === m.id && ms.status === 'active');
          return (
            <div key={m.id} className="card p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold">
                  {m.full_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-white">{m.full_name}</p>
                  <p className="text-xs text-dark-400">{mem ? `${mem.plan?.name ?? 'Plan'} • Expires ${new Date(mem.end_date).toLocaleDateString()}` : 'No active membership'}</p>
                </div>
              </div>
              <select
                value={m.role}
                onChange={(e) => updateRole(m.id, e.target.value)}
                className="bg-dark-800 border border-dark-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-primary-600"
              >
                <option value="member">Member</option>
                <option value="trainer">Trainer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BookingsTab({ bookings, onUpdate }: { bookings: any[]; onUpdate: (id: string, status: string) => void }) {
  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-white mb-6">Manage Bookings</h1>
      <div className="space-y-3">
        {bookings.length === 0 ? (
          <p className="text-dark-400 text-center py-8">No bookings yet.</p>
        ) : (
          bookings.map((b) => (
            <div key={b.id} className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-medium text-white">
                    {b.booking_type === 'trainer' ? b.trainer?.name : b.booking_type === 'class' ? b.fitness_class?.name : b.service?.name ?? 'Session'}
                  </p>
                  <p className="text-xs text-dark-400 capitalize">{b.booking_type} • {new Date(b.booking_date).toLocaleDateString()} at {b.start_time.slice(0, 5)}</p>
                </div>
                <span className={`badge capitalize ${
                  b.status === 'approved' ? 'bg-primary-600/20 text-primary-400' :
                  b.status === 'pending' ? 'bg-accent-500/20 text-accent-400' :
                  b.status === 'cancelled' || b.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                  'bg-dark-700 text-dark-400'
                }`}>{b.status}</span>
              </div>
              {b.status === 'pending' && (
                <div className="flex gap-2 mt-3">
                  <button onClick={() => onUpdate(b.id, 'approved')} className="flex items-center gap-1 px-3 py-1.5 bg-primary-600/20 text-primary-400 hover:bg-primary-600/30 rounded-lg text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4" /> Approve
                  </button>
                  <button onClick={() => onUpdate(b.id, 'rejected')} className="flex items-center gap-1 px-3 py-1.5 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg text-sm font-medium">
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function TrainersTab({ trainers, onUpdate }: { trainers: Trainer[]; onUpdate: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', qualification: '', experience_years: 0, specialty: '', bio: '', photo_url: '', rating: 5 });

  const add = async () => {
    await supabase.from('trainers').insert(form);
    setForm({ name: '', qualification: '', experience_years: 0, specialty: '', bio: '', photo_url: '', rating: 5 });
    setShowForm(false);
    onUpdate();
  };

  const remove = async (id: string) => {
    await supabase.from('trainers').delete().eq('id', id);
    onUpdate();
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Manage Trainers</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm"><Plus className="w-4 h-4" /> Add Trainer</button>
      </div>
      {showForm && (
        <div className="card p-6 mb-6 space-y-3 animate-slide-down">
          <div className="grid sm:grid-cols-2 gap-3">
            <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
            <input placeholder="Qualification" value={form.qualification} onChange={(e) => setForm({ ...form, qualification: e.target.value })} className="input-field" />
            <input placeholder="Specialty" value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} className="input-field" />
            <input type="number" placeholder="Years experience" value={form.experience_years} onChange={(e) => setForm({ ...form, experience_years: parseInt(e.target.value) || 0 })} className="input-field" />
            <input placeholder="Photo URL" value={form.photo_url} onChange={(e) => setForm({ ...form, photo_url: e.target.value })} className="input-field sm:col-span-2" />
            <textarea placeholder="Bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="input-field sm:col-span-2 resize-none" rows={3} />
          </div>
          <button onClick={add} className="btn-primary text-sm">Save Trainer</button>
        </div>
      )}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {trainers.map((t) => (
          <div key={t.id} className="card p-4">
            <div className="flex items-center gap-3 mb-3">
              <img src={t.photo_url} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
              <div className="min-w-0">
                <p className="font-medium text-white truncate">{t.name}</p>
                <p className="text-xs text-dark-400">{t.specialty}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-dark-400">{t.experience_years} yrs exp • {t.rating} rating</span>
              <button onClick={() => remove(t.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ServicesTab({ services, onUpdate }: { services: Service[]; onUpdate: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', duration_minutes: 60, price: 0, category: '', icon: 'dumbbell', image_url: '', is_featured: false });

  const add = async () => {
    await supabase.from('services').insert(form);
    setForm({ name: '', description: '', duration_minutes: 60, price: 0, category: '', icon: 'dumbbell', image_url: '', is_featured: false });
    setShowForm(false);
    onUpdate();
  };

  const remove = async (id: string) => {
    await supabase.from('services').delete().eq('id', id);
    onUpdate();
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Manage Services</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm"><Plus className="w-4 h-4" /> Add Service</button>
      </div>
      {showForm && (
        <div className="card p-6 mb-6 space-y-3 animate-slide-down">
          <div className="grid sm:grid-cols-2 gap-3">
            <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
            <input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field" />
            <input type="number" placeholder="Duration (min)" value={form.duration_minutes} onChange={(e) => setForm({ ...form, duration_minutes: parseInt(e.target.value) || 60 })} className="input-field" />
            <input type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} className="input-field" />
            <input placeholder="Image URL" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="input-field sm:col-span-2" />
            <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field sm:col-span-2 resize-none" rows={3} />
          </div>
          <button onClick={add} className="btn-primary text-sm">Save Service</button>
        </div>
      )}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((s) => (
          <div key={s.id} className="card p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-medium text-white">{s.name}</p>
                <p className="text-xs text-dark-400">{s.category} • ${s.price} • {s.duration_minutes}min</p>
              </div>
              <button onClick={() => remove(s.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
            </div>
            <p className="text-sm text-dark-400 line-clamp-2">{s.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PlansTab({ plans, onUpdate }: { plans: MembershipPlan[]; onUpdate: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', price: 0, duration_days: 30, benefits: '', features: '', is_popular: false });

  const add = async () => {
    await supabase.from('membership_plans').insert({
      name: form.name,
      description: form.description,
      price: form.price,
      duration_days: form.duration_days,
      benefits: form.benefits.split(',').map((b) => b.trim()).filter(Boolean),
      features: form.features.split(',').map((f) => f.trim()).filter(Boolean),
      is_popular: form.is_popular,
    });
    setForm({ name: '', description: '', price: 0, duration_days: 30, benefits: '', features: '', is_popular: false });
    setShowForm(false);
    onUpdate();
  };

  const remove = async (id: string) => {
    await supabase.from('membership_plans').delete().eq('id', id);
    onUpdate();
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Manage Plans</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm"><Plus className="w-4 h-4" /> Add Plan</button>
      </div>
      {showForm && (
        <div className="card p-6 mb-6 space-y-3 animate-slide-down">
          <div className="grid sm:grid-cols-2 gap-3">
            <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
            <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field" />
            <input type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} className="input-field" />
            <input type="number" placeholder="Duration (days)" value={form.duration_days} onChange={(e) => setForm({ ...form, duration_days: parseInt(e.target.value) || 30 })} className="input-field" />
            <input placeholder="Benefits (comma separated)" value={form.benefits} onChange={(e) => setForm({ ...form, benefits: e.target.value })} className="input-field sm:col-span-2" />
            <input placeholder="Features (comma separated)" value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} className="input-field sm:col-span-2" />
            <label className="flex items-center gap-2 text-sm text-dark-300">
              <input type="checkbox" checked={form.is_popular} onChange={(e) => setForm({ ...form, is_popular: e.target.checked })} className="w-4 h-4 rounded" />
              Mark as popular
            </label>
          </div>
          <button onClick={add} className="btn-primary text-sm">Save Plan</button>
        </div>
      )}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {plans.map((p) => (
          <div key={p.id} className="card p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-medium text-white">{p.name} {p.is_popular && <span className="badge bg-primary-600/20 text-primary-400 ml-1">Popular</span>}</p>
                <p className="text-xs text-dark-400">${p.price} • {p.duration_days} days</p>
              </div>
              <button onClick={() => remove(p.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
            </div>
            <p className="text-sm text-dark-400 line-clamp-2">{p.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnnouncementsTab({ announcements, onUpdate }: { announcements: Announcement[]; onUpdate: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', category: 'news', image_url: '' });

  const add = async () => {
    await supabase.from('announcements').insert({ ...form, is_published: true, published_at: new Date().toISOString() });
    setForm({ title: '', content: '', category: 'news', image_url: '' });
    setShowForm(false);
    onUpdate();
  };

  const remove = async (id: string) => {
    await supabase.from('announcements').delete().eq('id', id);
    onUpdate();
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Manage Announcements</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm"><Plus className="w-4 h-4" /> Add Announcement</button>
      </div>
      {showForm && (
        <div className="card p-6 mb-6 space-y-3 animate-slide-down">
          <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" />
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field">
            <option value="news">News</option>
            <option value="competition">Competition</option>
            <option value="holiday">Holiday</option>
            <option value="promotion">Promotion</option>
            <option value="tips">Tips</option>
            <option value="new_service">New Service</option>
          </select>
          <input placeholder="Image URL (optional)" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="input-field" />
          <textarea placeholder="Content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="input-field resize-none" rows={4} />
          <button onClick={add} className="btn-primary text-sm">Publish</button>
        </div>
      )}
      <div className="space-y-3">
        {announcements.map((a) => (
          <div key={a.id} className="card p-4 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="badge bg-dark-800 text-primary-400 capitalize">{a.category.replace('_', ' ')}</span>
                <span className="text-xs text-dark-500">{new Date(a.published_at).toLocaleDateString()}</span>
              </div>
              <p className="font-medium text-white">{a.title}</p>
              <p className="text-sm text-dark-400 line-clamp-2 mt-1">{a.content}</p>
            </div>
            <button onClick={() => remove(a.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg shrink-0"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

function GalleryTab({ onUpdate }: { onUpdate: () => void }) {
  const [items, setItems] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', image_url: '', category: 'facility' });

  useEffect(() => {
    supabase.from('gallery').select('*').order('created_at', { ascending: false }).then(({ data }) => setItems(data ?? []));
  }, [onUpdate]);

  const add = async () => {
    await supabase.from('gallery').insert(form);
    setForm({ title: '', description: '', image_url: '', category: 'facility' });
    setShowForm(false);
    onUpdate();
  };

  const remove = async (id: string) => {
    await supabase.from('gallery').delete().eq('id', id);
    onUpdate();
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Manage Gallery</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm"><Plus className="w-4 h-4" /> Add Image</button>
      </div>
      {showForm && (
        <div className="card p-6 mb-6 space-y-3 animate-slide-down">
          <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" />
          <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field" />
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field">
            <option value="facility">Facility</option>
            <option value="equipment">Equipment</option>
            <option value="events">Events</option>
            <option value="sessions">Sessions</option>
          </select>
          <input placeholder="Image URL" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="input-field" />
          <button onClick={add} className="btn-primary text-sm">Add Image</button>
        </div>
      )}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.id} className="card overflow-hidden">
            <img src={item.image_url} alt={item.title} className="w-full h-40 object-cover" />
            <div className="p-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">{item.title}</p>
                <p className="text-xs text-dark-400 capitalize">{item.category}</p>
              </div>
              <button onClick={() => remove(item.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
