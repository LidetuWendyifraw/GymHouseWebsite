import { useEffect, useState } from 'react';
import { CheckCircle2, Star, ArrowRight, Calendar } from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { MembershipPlan } from '../types';

export default function Membership() {
  const { navigate } = useRouter();
  const { user } = useAuth();
  const [plans, setPlans] = useState<MembershipPlan[]>([]);

  useEffect(() => {
    supabase.from('membership_plans').select('*').order('price').then(({ data }) => setPlans(data as MembershipPlan[] ?? []));
  }, []);

  const handleJoin = async (plan: MembershipPlan) => {
    if (!user) {
      navigate('/register');
      return;
    }
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.duration_days);
    await supabase.from('memberships').insert({
      user_id: user.id,
      plan_id: plan.id,
      start_date: new Date().toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      status: 'active',
      payment_amount: plan.price,
    });
    await supabase.from('notifications').insert({
      user_id: user.id,
      title: 'Membership Activated',
      message: `Your ${plan.name} is now active! Enjoy your fitness journey.`,
      type: 'membership',
    });
    navigate('/dashboard');
  };

  return (
    <div className="pt-20 animate-fade-in">
      <section className="relative h-[35vh] flex items-center justify-center overflow-hidden">
        <img src="https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=1920" alt="Membership" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-dark-950/80" />
        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">Membership <span className="text-gradient">Plans</span></h1>
          <p className="text-dark-300 max-w-2xl mx-auto px-4">Choose the plan that fits your fitness journey and budget.</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-max">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`card p-6 flex flex-col relative ${plan.is_popular ? 'border-primary-600 ring-1 ring-primary-600 lg:scale-105' : ''}`}
              >
                {plan.is_popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 badge bg-primary-600 text-white px-4 py-1">
                    <Star className="w-3 h-3" /> Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-xs text-dark-400 mb-4 min-h-[32px]">{plan.description}</p>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-white font-display">${plan.price}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-dark-400 mb-4">
                  <Calendar className="w-3.5 h-3.5" />
                  {plan.duration_days} days access
                </div>
                <ul className="space-y-2 mb-6 flex-1">
                  {plan.benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-dark-300">
                      <CheckCircle2 className="w-4 h-4 text-primary-500 mt-0.5 shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleJoin(plan)}
                  className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                    plan.is_popular ? 'bg-primary-600 hover:bg-primary-500 text-white' : 'bg-dark-800 hover:bg-dark-700 text-white'
                  }`}
                >
                  Join Now
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-12 card p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-2">Not Sure Which Plan is Right?</h3>
            <p className="text-dark-400 mb-6">Contact us and our team will help you choose the perfect plan for your goals.</p>
            <button onClick={() => navigate('/contact')} className="btn-secondary">Talk to Us</button>
          </div>
        </div>
      </section>
    </div>
  );
}
