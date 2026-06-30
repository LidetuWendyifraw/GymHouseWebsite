import { useEffect, useState } from 'react';
import { Star, Award, Briefcase, ArrowRight } from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import { supabase } from '../lib/supabase';
import { Trainer } from '../types';

export default function Trainers() {
  const { navigate } = useRouter();
  const [trainers, setTrainers] = useState<Trainer[]>([]);

  useEffect(() => {
    supabase.from('trainers').select('*').eq('is_active', true).order('rating', { ascending: false }).then(({ data }) => setTrainers(data as Trainer[] ?? []));
  }, []);

  return (
    <div className="pt-20 animate-fade-in">
      <section className="relative h-[35vh] flex items-center justify-center overflow-hidden">
        <img src="https://images.pexels.com/photos/703012/pexels-photo-703012.jpeg?auto=compress&cs=tinysrgb&w=1920" alt="Trainers" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-dark-950/80" />
        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">Our <span className="text-gradient">Trainers</span></h1>
          <p className="text-dark-300 max-w-2xl mx-auto px-4">Meet the certified professionals who will guide your fitness journey.</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-max">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trainers.map((trainer) => (
              <div key={trainer.id} className="card card-hover group">
                <div className="relative h-80 overflow-hidden">
                  <img src={trainer.photo_url} alt={trainer.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/40 to-transparent" />
                  {trainer.rating > 0 && (
                    <div className="absolute top-4 right-4 badge bg-dark-950/80 text-accent-400">
                      <Star className="w-3 h-3 fill-accent-400" /> {trainer.rating}
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-xl font-bold text-white">{trainer.name}</h3>
                    <p className="text-sm text-primary-400">{trainer.specialty}</p>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2 text-sm text-dark-300">
                    <Award className="w-4 h-4 text-primary-500" />
                    {trainer.qualification}
                  </div>
                  <div className="flex items-center gap-2 mb-3 text-sm text-dark-300">
                    <Briefcase className="w-4 h-4 text-primary-500" />
                    {trainer.experience_years} years experience
                  </div>
                  <p className="text-sm text-dark-400 mb-4 line-clamp-3">{trainer.bio}</p>
                  <button onClick={() => navigate('/register')} className="w-full btn-secondary text-sm">
                    Book a Session
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
