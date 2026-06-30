import { Dumbbell, Facebook, Instagram, Twitter, Youtube, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useRouter } from '../context/RouterContext';

export default function Footer() {
  const { navigate } = useRouter();

  const quickLinks = [
    { label: 'About Us', to: '/about' },
    { label: 'Services', to: '/services' },
    { label: 'Trainers', to: '/trainers' },
    { label: 'Membership', to: '/membership' },
    { label: 'Gallery', to: '/gallery' },
    { label: 'FAQ', to: '/faq' },
  ];

  return (
    <footer className="bg-dark-950 border-t border-dark-800 mt-20">
      <div className="container-max px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary-600 flex items-center justify-center">
                <Dumbbell className="w-6 h-6 text-white" />
              </div>
              <span className="font-display text-xl font-bold text-white tracking-wider">
                GYM<span className="text-primary-500">HOUSE</span>
              </span>
            </div>
            <p className="text-sm text-dark-400 leading-relaxed mb-4">
              Your premier fitness destination. Build strength, endurance, and a healthier lifestyle with our
              world-class facilities and expert trainers.
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-dark-800 hover:bg-primary-600 flex items-center justify-center text-dark-300 hover:text-white transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <button
                    onClick={() => navigate(link.to)}
                    className="text-sm text-dark-400 hover:text-primary-400 transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-dark-400">
                <MapPin className="w-4 h-4 text-primary-500 mt-0.5 shrink-0" />
                <span>123 Fitness Avenue, Downtown District, New York, NY 10001</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-dark-400">
                <Phone className="w-4 h-4 text-primary-500 shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-dark-400">
                <Mail className="w-4 h-4 text-primary-500 shrink-0" />
                <span>info@gymhouse.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Hours</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-3 text-sm text-dark-400">
                <Clock className="w-4 h-4 text-primary-500 shrink-0" />
                <span>Mon - Fri: 5am - 11pm</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-dark-400">
                <Clock className="w-4 h-4 text-primary-500 shrink-0" />
                <span>Saturday: 6am - 10pm</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-dark-400">
                <Clock className="w-4 h-4 text-primary-500 shrink-0" />
                <span>Sunday: 7am - 9pm</span>
              </li>
            </ul>
            <button onClick={() => navigate('/membership')} className="btn-primary text-sm mt-4 w-full">
              Start Your Journey
            </button>
          </div>
        </div>

        <div className="border-t border-dark-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-dark-500">© 2026 Lidetu Wedyifraw via LW-tech. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-dark-500 hover:text-primary-400 transition-colors">Privacy Policy</a>
            <a href="#" className="text-sm text-dark-500 hover:text-primary-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
