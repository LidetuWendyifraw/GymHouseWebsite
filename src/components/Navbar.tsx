import { useState, useEffect } from 'react';
import { Dumbbell, Menu, X, User, LogOut, LayoutDashboard, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '../context/RouterContext';
import { supabase } from '../lib/supabase';
import { Notification } from '../types';

export default function Navbar() {
  const { path, navigate } = useRouter();
  const { user, profile, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (user) {
      supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10)
        .then(({ data }) => setNotifications((data as Notification[]) ?? []));
    }
  }, [user, path]);

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'About', to: '/about' },
    { label: 'Services', to: '/services' },
    { label: 'Trainers', to: '/trainers' },
    { label: 'Membership', to: '/membership' },
    { label: 'Gallery', to: '/gallery' },
    { label: 'News', to: '/news' },
    { label: 'Contact', to: '/contact' },
  ];

  const isActive = (to: string) => (to === '/' ? path === '/' : path.startsWith(to));

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setUserMenuOpen(false);
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-dark-950/95 backdrop-blur-md border-b border-dark-800 shadow-lg' : 'bg-transparent'
      }`}
    >
      <nav className="container-max px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-lg bg-primary-600 flex items-center justify-center group-hover:scale-110 transition-transform">
             <img src="src\components\images\logo.jpg" alt="the gym-logo" className="w-10 h-10 rounded-full object-cover group-hover:scale-110 transition-transform"/>
            </div>
            <span className="font-display text-xl font-bold text-white tracking-wider">
              POWER PLUS &nbsp;<span className="text-primary-500">GYM</span>
            </span>
          </button>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.to}
                onClick={() => navigate(link.to)}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive(link.to)
                    ? 'text-primary-400 bg-primary-950/50'
                    : 'text-dark-300 hover:text-white hover:bg-dark-800/50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="relative p-2 text-dark-300 hover:text-white hover:bg-dark-800 rounded-lg transition-all"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-accent-500 text-dark-950 text-[10px] font-bold rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {notifOpen && (
                  <div className="absolute top-16 right-32 w-80 bg-dark-900 border border-dark-800 rounded-xl shadow-2xl overflow-hidden animate-slide-down z-50">
                    <div className="p-3 border-b border-dark-800 flex items-center justify-between">
                      <span className="font-semibold text-white">Notifications</span>
                      <button onClick={() => setNotifOpen(false)} className="text-dark-400 hover:text-white">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="p-4 text-sm text-dark-400 text-center">No notifications yet</p>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            className={`p-3 border-b border-dark-800 hover:bg-dark-800/50 ${!n.is_read ? 'bg-primary-950/20' : ''}`}
                          >
                            <p className="text-sm font-medium text-white">{n.title}</p>
                            <p className="text-xs text-dark-400 mt-1">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1.5 pr-3 rounded-lg hover:bg-dark-800 transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-bold">
                      {profile?.full_name?.charAt(0).toUpperCase() ?? 'U'}
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-white max-w-24 truncate">
                      {profile?.full_name ?? 'User'}
                    </span>
                  </button>

                  {userMenuOpen && (
                    <div className="absolute top-full right-0 mt-2 w-56 bg-dark-900 border border-dark-800 rounded-xl shadow-2xl overflow-hidden animate-slide-down">
                      <div className="p-3 border-b border-dark-800">
                        <p className="text-sm font-medium text-white truncate">{profile?.full_name}</p>
                        <p className="text-xs text-dark-400 capitalize">{profile?.role}</p>
                      </div>
                      <button
                        onClick={() => {
                          navigate(profile?.role === 'admin' ? '/admin' : '/dashboard');
                          setUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-dark-200 hover:bg-dark-800 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </button>
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-dark-800 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <button onClick={() => navigate('/login')} className="btn-ghost text-sm">
                  Sign In
                </button>
                <button onClick={() => navigate('/register')} className="btn-primary text-sm">
                  Join Now
                </button>
              </div>
            )}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-white hover:bg-dark-800 rounded-lg transition-all"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="lg:hidden pb-4 animate-slide-down">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.to}
                  onClick={() => {
                    navigate(link.to);
                    setMobileOpen(false);
                  }}
                  className={`px-4 py-2.5 text-left text-sm font-medium rounded-lg transition-all ${
                    isActive(link.to) ? 'text-primary-400 bg-primary-950/50' : 'text-dark-300 hover:text-white hover:bg-dark-800'
                  }`}
                >
                  {link.label}
                </button>
              ))}
              {!user && (
                <div className="flex gap-2 mt-2 px-2">
                  <button
                    onClick={() => {
                      navigate('/login');
                      setMobileOpen(false);
                    }}
                    className="btn-secondary flex-1 text-sm"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      navigate('/register');
                      setMobileOpen(false);
                    }}
                    className="btn-primary flex-1 text-sm"
                  >
                    Join Now
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
