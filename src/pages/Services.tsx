import { useEffect, useState } from 'react';
import { Dumbbell, Heart, User, Users, Flower, Wind, Flame, Apple, Clock, DollarSign, ArrowRight } from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import { supabase } from '../lib/supabase';
import { Service } from '../types';

const iconMap: Record<string, typeof Dumbbell> = {
  dumbbell: Dumbbell, heart: Heart, user: User, users: Users,
  flower: Flower, wind: Wind, flame: Flame, apple: Apple,
};

export default function Services() {
  const { navigate } = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    supabase.from('services').select('*').order('name').then(({ data }) => setServices(data as Service[] ?? []));
  }, []);

  const categories = ['all', ...Array.from(new Set(services.map((s) => s.category)))];
  const filtered = filter === 'all' ? services : services.filter((s) => s.category === filter);

  return (
    <div className="pt-20 animate-fade-in">
      <section className="relative h-[35vh] flex items-center justify-center overflow-hidden">
        <img src="https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=1920" alt="Services" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-dark-950/80" />
        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">Our <span className="text-gradient">Services</span></h1>
          <p className="text-dark-300 max-w-2xl mx-auto px-4">Comprehensive fitness services designed for every goal and level.</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-max">
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                  filter === cat ? 'bg-primary-600 text-white' : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((service) => {
              const Icon = iconMap[service.icon] ?? Dumbbell;
              return (
                <div key={service.id} className="card card-hover group">
                  <div className="relative h-56 overflow-hidden">
                    <img src={service.image_url} alt={service.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-950 to-transparent" />
                    <div className="absolute top-4 left-4 w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="absolute top-4 right-4 badge bg-dark-950/80 text-primary-400">{service.category}</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">{service.name}</h3>
                    <p className="text-sm text-dark-400 mb-4">{service.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-dark-300">
                        <Clock className="w-4 h-4 text-primary-500" />
                        <span className="text-sm">{service.duration_minutes} min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-primary-500" />
                        <span className="text-lg font-bold text-white">{service.price}</span>
                      </div>
                    </div>
                    <button onClick={() => navigate('/register')} className="w-full btn-primary text-sm">
                      Book This Service
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
