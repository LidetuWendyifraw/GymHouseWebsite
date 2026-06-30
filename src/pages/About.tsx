import { Target, Eye, Heart, Award, Users, TrendingUp, Shield, Zap } from 'lucide-react';
import { useRouter } from '../context/RouterContext';

export default function About() {
  const { navigate } = useRouter();

  const values = [
    { icon: Heart, title: 'Passion', desc: 'We are passionate about fitness and helping others achieve their goals.' },
    { icon: Shield, title: 'Integrity', desc: 'We operate with honesty, transparency, and respect for every member.' },
    { icon: TrendingUp, title: 'Excellence', desc: 'We strive for excellence in everything we do, from equipment to service.' },
    { icon: Users, title: 'Community', desc: 'We build a supportive community where everyone belongs and thrives.' },
  ];

  const achievements = [
    { value: '10+', label: 'Years of Service' },
    { value: '2,500+', label: 'Happy Members' },
    { value: '15+', label: 'Expert Trainers' },
    { value: '50+', label: 'Weekly Classes' },
    { value: '15,000', label: 'Sq Ft Facility' },
    { value: '98%', label: 'Satisfaction' },
  ];

  return (
    <div className="pt-20 animate-fade-in">
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <img src="https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=1920" alt="About" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-dark-950/80" />
        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">About <span className="text-gradient">Gym House</span></h1>
          <p className="text-dark-300 max-w-2xl mx-auto px-4">Your trusted partner in fitness and wellness since 2015.</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-max grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="badge bg-primary-600/20 text-primary-400 border border-primary-600/30 mb-4">Our History</div>
            <h2 className="text-4xl font-bold text-white mb-6">A Decade of <span className="text-gradient">Dedication</span></h2>
            <p className="text-dark-300 mb-4 leading-relaxed">
              Gym House was founded in 2015 with a simple mission: to create a fitness space where everyone feels
              welcome, supported, and empowered to reach their full potential.
            </p>
            <p className="text-dark-400 mb-4 leading-relaxed">
              What started as a small neighborhood gym has grown into the city's premier fitness destination,
              serving over 2,500 active members with state-of-the-art facilities and world-class training programs.
            </p>
            <p className="text-dark-400 leading-relaxed">
              Today, we continue to innovate and expand our services, always putting our members' success at the
              heart of everything we do.
            </p>
          </div>
          <img src="https://images.pexels.com/photos/703012/pexels-photo-703012.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Gym History" className="rounded-2xl w-full h-[400px] object-cover" />
        </div>
      </section>

      <section className="section-padding bg-dark-900/50">
        <div className="container-max">
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="card p-8">
              <div className="w-14 h-14 rounded-xl bg-primary-600/20 flex items-center justify-center mb-4">
                <Target className="w-7 h-7 text-primary-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Our Mission</h3>
              <p className="text-dark-300 leading-relaxed">
                To empower individuals to achieve their fitness goals through expert guidance, cutting-edge
                facilities, and a supportive community that fosters lasting transformation.
              </p>
            </div>
            <div className="card p-8">
              <div className="w-14 h-14 rounded-xl bg-accent-500/20 flex items-center justify-center mb-4">
                <Eye className="w-7 h-7 text-accent-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Our Vision</h3>
              <p className="text-dark-300 leading-relaxed">
                To be the most trusted and innovative fitness center in the region, setting the standard for
                excellence in health, wellness, and community engagement.
              </p>
            </div>
          </div>

          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Our <span className="text-gradient">Values</span></h2>
            <p className="text-dark-400">The principles that guide everything we do.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <div key={i} className="card p-6 text-center card-hover">
                <div className="w-14 h-14 rounded-xl bg-primary-600/20 flex items-center justify-center mx-auto mb-4">
                  <v.icon className="w-7 h-7 text-primary-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{v.title}</h3>
                <p className="text-sm text-dark-400">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-max">
          <div className="text-center mb-12">
            <div className="badge bg-accent-500/20 text-accent-400 border border-accent-500/30 mb-4 mx-auto">
              <Award className="w-3.5 h-3.5" /> Our Achievements
            </div>
            <h2 className="text-4xl font-bold text-white">Numbers That <span className="text-gradient">Speak</span></h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {achievements.map((a, i) => (
              <div key={i} className="card p-6 text-center">
                <p className="text-3xl font-bold text-primary-400 font-display">{a.value}</p>
                <p className="text-sm text-dark-400 mt-1">{a.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-dark-900/50">
        <div className="container-max text-center">
          <Zap className="w-12 h-12 text-primary-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Join the Family?</h2>
          <p className="text-dark-400 mb-8 max-w-xl mx-auto">Become part of a community that pushes you to be your best.</p>
          <button onClick={() => navigate('/register')} className="btn-primary text-base">Get Started Today</button>
        </div>
      </section>
    </div>
  );
}
