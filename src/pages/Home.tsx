import { useEffect, useState } from 'react';
import {
  Dumbbell, Heart, User, Users, Flower, Wind, Flame, Apple,
  ArrowRight, Star, Calendar, TrendingUp, Award, Zap, CheckCircle2, Quote,
} from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import { supabase } from '../lib/supabase';
import { Service, MembershipPlan, Testimonial, Announcement, Trainer } from '../types';

const iconMap: Record<string, typeof Dumbbell> = {
  dumbbell: Dumbbell, heart: Heart, user: User, users: Users,
  flower: Flower, wind: Wind, flame: Flame, apple: Apple,
};

export default function Home() {
  const { navigate } = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);

  useEffect(() => {
    Promise.all([
      supabase.from('services').select('*').eq('is_featured', true).order('name'),
      supabase.from('membership_plans').select('*').order('price'),
      supabase.from('testimonials').select('*').eq('is_featured', true).limit(3),
      supabase.from('announcements').select('*').eq('is_published', true).order('published_at', { ascending: false }).limit(3),
      supabase.from('trainers').select('*').eq('is_active', true).limit(4),
    ]).then(([s, p, t, a, tr]) => {
      setServices(s.data as Service[] ?? []);
      setPlans(p.data as MembershipPlan[] ?? []);
      setTestimonials(t.data as Testimonial[] ?? []);
      setAnnouncements(a.data as Announcement[] ?? []);
      setTrainers(tr.data as Trainer[] ?? []);
    });
  }, []);

  const stats = [
    { icon: Users, value: '2,500+', label: 'Active Members' },
    { icon: Award, value: '15+', label: 'Expert Trainers' },
    { icon: Calendar, value: '50+', label: 'Weekly Classes' },
    { icon: TrendingUp, value: '98%', label: 'Satisfaction Rate' },
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Gym"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-dark-950 via-dark-950/80 to-dark-950/40" />
        </div>

        <div className="relative z-10 container-max px-4 sm:px-6 lg:px-8 pt-20">
          <div className="max-w-3xl">
            <div className="badge bg-primary-600/20 text-primary-400 border border-primary-600/30 mb-6 animate-slide-up">
              <Zap className="w-3.5 h-3.5" />
              #1 Fitness Center in the City
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6 animate-slide-up">
              BUILD YOUR<br />
              <span className="text-gradient">BEST SELF</span><br />
              AT GYM HOUSE
            </h1>
            <p className="text-lg text-dark-300 mb-8 max-w-xl leading-relaxed animate-slide-up">
              Transform your body and mind with world-class facilities, expert trainers, and a community that
              pushes you to achieve more than you ever thought possible.
            </p>
            <div className="flex flex-wrap gap-4 animate-slide-up">
              <button onClick={() => navigate('/register')} className="btn-primary text-base">
                Start Your Journey
                <ArrowRight className="w-5 h-5" />
              </button>
              <button onClick={() => navigate('/services')} className="btn-secondary text-base">
                Explore Services
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-dark-950 to-transparent h-32 z-10" />
      </section>

      {/* Stats */}
      <section className="relative z-20 -mt-20 px-4 sm:px-6 lg:px-8">
        <div className="container-max">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 bg-dark-900 border border-dark-800 rounded-2xl p-6 lg:p-8 shadow-2xl">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 rounded-xl bg-primary-600/20 flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-6 h-6 text-primary-400" />
                </div>
                <p className="text-3xl font-bold text-white font-display">{stat.value}</p>
                <p className="text-sm text-dark-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Welcome / About teaser */}
      <section className="section-padding">
        <div className="container-max grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="badge bg-accent-500/20 text-accent-400 border border-accent-500/30 mb-4">
              Welcome to Gym House
            </div>
            <h2 className="text-4xl font-bold text-white mb-6">
              More Than a Gym —<br />A <span className="text-gradient">Lifestyle</span>
            </h2>
            <p className="text-dark-300 mb-4 leading-relaxed">
              Since 2015, Gym House has been the premier fitness destination for thousands of members. We believe
              fitness is not just about physical strength — it is about building confidence, discipline, and a
              community that supports your every step.
            </p>
            <p className="text-dark-400 mb-6 leading-relaxed">
              Our state-of-the-art facility spans over 15,000 square feet, equipped with the latest fitness
              technology, dedicated zones for every workout style, and a team of certified professionals dedicated
              to your success.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {['Certified Expert Trainers', 'Modern Equipment', 'Flexible Membership Plans', 'Personalized Programs'].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary-500 shrink-0" />
                  <span className="text-sm text-dark-200">{item}</span>
                </div>
              ))}
            </div>
            <button onClick={() => navigate('/about')} className="btn-primary">
              Learn More About Us
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Training"
              className="rounded-2xl w-full h-[400px] object-cover"
            />
            <div className="absolute -bottom-6 -left-6 bg-primary-600 text-white p-6 rounded-xl shadow-2xl hidden sm:block">
              <p className="text-4xl font-bold font-display">10+</p>
              <p className="text-sm">Years of Excellence</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section-padding bg-dark-900/50">
        <div className="container-max">
          <div className="text-center mb-12">
            <div className="badge bg-primary-600/20 text-primary-400 border border-primary-600/30 mb-4 mx-auto">
              Our Services
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Train Your <span className="text-gradient">Way</span>
            </h2>
            <p className="text-dark-400 max-w-2xl mx-auto">
              From strength training to yoga, we offer a comprehensive range of fitness services tailored to every
              goal and fitness level.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => {
              const Icon = iconMap[service.icon] ?? Dumbbell;
              return (
                <div key={service.id} className="card card-hover group cursor-pointer" onClick={() => navigate('/services')}>
                  <div className="relative h-48 overflow-hidden">
                    <img src={service.image_url} alt={service.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-950 to-transparent" />
                    <div className="absolute top-4 left-4 w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-white mb-2">{service.name}</h3>
                    <p className="text-sm text-dark-400 mb-3 line-clamp-2">{service.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-primary-400 font-bold">${service.price}</span>
                      <span className="text-xs text-dark-500">{service.duration_minutes} min</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <button onClick={() => navigate('/services')} className="btn-secondary">
              View All Services
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Membership Plans */}
      <section className="section-padding">
        <div className="container-max">
          <div className="text-center mb-12">
            <div className="badge bg-accent-500/20 text-accent-400 border border-accent-500/30 mb-4 mx-auto">
              Membership Plans
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Choose Your <span className="text-gradient">Plan</span>
            </h2>
            <p className="text-dark-400 max-w-2xl mx-auto">
              Flexible membership options designed to fit your lifestyle and fitness goals.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`card p-6 flex flex-col relative ${plan.is_popular ? 'border-primary-600 ring-1 ring-primary-600' : ''}`}
              >
                {plan.is_popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 badge bg-primary-600 text-white px-4 py-1">
                    <Star className="w-3 h-3" /> Popular
                  </div>
                )}
                <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-xs text-dark-400 mb-4 line-clamp-2">{plan.description}</p>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-white font-display">${plan.price}</span>
                  <span className="text-sm text-dark-400">/{plan.duration_days === 1 ? 'day' : plan.duration_days === 7 ? 'week' : plan.duration_days === 30 ? 'month' : plan.duration_days === 90 ? 'quarter' : 'year'}</span>
                </div>
                <ul className="space-y-2 mb-6 flex-1">
                  {plan.benefits.slice(0, 4).map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-dark-300">
                      <CheckCircle2 className="w-4 h-4 text-primary-500 mt-0.5 shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate('/membership')}
                  className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-all ${
                    plan.is_popular ? 'bg-primary-600 hover:bg-primary-500 text-white' : 'bg-dark-800 hover:bg-dark-700 text-white'
                  }`}
                >
                  Join Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trainers teaser */}
      <section className="section-padding bg-dark-900/50">
        <div className="container-max">
          <div className="text-center mb-12">
            <div className="badge bg-primary-600/20 text-primary-400 border border-primary-600/30 mb-4 mx-auto">
              Meet the Team
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Expert <span className="text-gradient">Trainers</span>
            </h2>
            <p className="text-dark-400 max-w-2xl mx-auto">
              Our certified trainers are here to guide, motivate, and push you toward your fitness goals.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trainers.map((trainer) => (
              <div key={trainer.id} className="card card-hover group cursor-pointer" onClick={() => navigate('/trainers')}>
                <div className="relative h-72 overflow-hidden">
                  <img src={trainer.photo_url} alt={trainer.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-lg font-bold text-white">{trainer.name}</h3>
                    <p className="text-sm text-primary-400">{trainer.specialty}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3.5 h-3.5 text-accent-400 fill-accent-400" />
                      <span className="text-xs text-dark-300">{trainer.rating} Rating</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button onClick={() => navigate('/trainers')} className="btn-secondary">
              Meet All Trainers
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding">
        <div className="container-max">
          <div className="text-center mb-12">
            <div className="badge bg-accent-500/20 text-accent-400 border border-accent-500/30 mb-4 mx-auto">
              Success Stories
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              What Our <span className="text-gradient">Members Say</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.id} className="card p-6">
                <Quote className="w-8 h-8 text-primary-600 mb-4" />
                <p className="text-dark-200 mb-6 leading-relaxed text-sm">"{t.content}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar_url} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <p className="font-semibold text-white text-sm">{t.name}</p>
                    <p className="text-xs text-dark-400">{t.role}</p>
                    <div className="flex gap-0.5 mt-1">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-accent-400 fill-accent-400" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Announcements */}
      <section className="section-padding bg-dark-900/50">
        <div className="container-max">
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="badge bg-primary-600/20 text-primary-400 border border-primary-600/30 mb-4">
                Latest News
              </div>
              <h2 className="text-4xl font-bold text-white">
                News & <span className="text-gradient">Announcements</span>
              </h2>
            </div>
            <button onClick={() => navigate('/news')} className="btn-ghost hidden sm:flex">
              View All
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {announcements.map((a) => (
              <div key={a.id} className="card card-hover cursor-pointer" onClick={() => navigate('/news')}>
                {a.image_url && (
                  <div className="h-48 overflow-hidden">
                    <img src={a.image_url} alt={a.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-5">
                  <span className="badge bg-dark-800 text-primary-400 mb-3 capitalize">{a.category.replace('_', ' ')}</span>
                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{a.title}</h3>
                  <p className="text-sm text-dark-400 line-clamp-3">{a.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container-max">
          <div className="relative rounded-3xl overflow-hidden">
            <img
              src="https://images.pexels.com/photos/4753986/pexels-photo-4753986.jpeg?auto=compress&cs=tinysrgb&w=1920"
              alt="CTA"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary-900/95 to-primary-700/80" />
            <div className="relative z-10 p-12 lg:p-20 text-center">
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                Ready to Start Your Transformation?
              </h2>
              <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
                Join Gym House today and take the first step toward a stronger, healthier, and more confident you.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <button onClick={() => navigate('/register')} className="btn-accent text-base">
                  Join Now
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button onClick={() => navigate('/contact')} className="btn-secondary text-base bg-white/10 border-white/20 hover:bg-white/20">
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
