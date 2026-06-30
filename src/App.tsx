import { AuthProvider, useAuth } from './context/AuthContext';
import { RouterProvider, useRouter } from './context/RouterContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Trainers from './pages/Trainers';
import Membership from './pages/Membership';
import Gallery from './pages/Gallery';
import News from './pages/News';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';

function AppContent() {
  const { path, navigate } = useRouter();
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const noNavPages = ['/login', '/register'];
  const showNav = !noNavPages.includes(path);

  const renderPage = () => {
    if (path === '/' || path === '') return <Home />;
    if (path === '/about') return <About />;
    if (path === '/services') return <Services />;
    if (path === '/trainers') return <Trainers />;
    if (path === '/membership') return <Membership />;
    if (path === '/gallery') return <Gallery />;
    if (path === '/news') return <News />;
    if (path === '/contact') return <Contact />;
    if (path === '/faq') return <FAQ />;
    if (path === '/login') return user ? <Dashboard /> : <Login />;
    if (path === '/register') return user ? <Dashboard /> : <Register />;
    if (path === '/dashboard') {
      if (!user) return <Login />;
      if (profile?.role === 'admin') return <AdminDashboard />;
      return <Dashboard />;
    }
    if (path === '/admin') {
      if (!user) return <Login />;
      if (profile?.role !== 'admin') return <Dashboard />;
      return <AdminDashboard />;
    }
    return <Home />;
  };

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col">
      {showNav && <Navbar />}
      <div className="flex-1">{renderPage()}</div>
      {showNav && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider>
        <AppContent />
      </RouterProvider>
    </AuthProvider>
  );
}
