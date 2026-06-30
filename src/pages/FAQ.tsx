import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  { q: 'How do I become a member of Gym House?', a: 'You can register online through our website by clicking "Join Now" and filling out the registration form. Once registered, you can choose a membership plan that suits your needs and start your fitness journey immediately.' },
  { q: 'What membership plans do you offer?', a: 'We offer five membership plans: Daily Pass ($15), Weekly ($60), Monthly ($120), Quarterly ($300), and Annual ($1000). Each plan includes different benefits — check our Membership page for full details.' },
  { q: 'Can I book personal training sessions?', a: 'Yes! As a member, you can book personal training sessions with any of our certified trainers through your member dashboard. Simply select the trainer, date, and time that works for you.' },
  { q: 'What are your operating hours?', a: 'We are open Monday to Friday from 5:00 AM to 11:00 PM, Saturday from 6:00 AM to 10:00 PM, and Sunday from 7:00 AM to 9:00 PM. Holiday hours may vary.' },
  { q: 'Do you offer group fitness classes?', a: 'Yes, we offer a wide variety of group classes including HIIT, yoga, CrossFit, cardio kickboxing, and more. Check our class schedule and book through your dashboard.' },
  { q: 'How do I cancel or reschedule a booking?', a: 'You can manage all your bookings through your member dashboard. Simply navigate to the Bookings section, find the booking you want to change, and click cancel or reschedule.' },
  { q: 'What should I bring to the gym?', a: 'We recommend bringing workout clothes, athletic shoes, a water bottle, and a towel. Lockers are available for your belongings. Showers are also provided.' },
  { q: 'Can I freeze or cancel my membership?', a: 'Yes, you can request to freeze or cancel your membership by contacting our front desk. Certain terms and conditions apply depending on your membership plan.' },
  { q: 'Do you offer nutrition consultation?', a: 'Yes! We have certified nutritionists who provide personalized nutrition plans and dietary advice. You can book a nutrition consultation through our services page.' },
  { q: 'Is there a free trial available?', a: 'We offer a Daily Pass for just $15 which gives you full access to try our facilities. Some promotions may include free trial days — check our announcements for current offers.' },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="pt-20 animate-fade-in">
      <section className="relative h-[35vh] flex items-center justify-center overflow-hidden">
        <img src="https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=1920" alt="FAQ" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-dark-950/80" />
        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">Frequently Asked <span className="text-gradient">Questions</span></h1>
          <p className="text-dark-300 max-w-2xl mx-auto px-4">Find answers to common questions about Gym House.</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-max max-w-3xl">
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="card overflow-hidden">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-semibold text-white">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-primary-400 transition-transform shrink-0 ml-4 ${open === i ? 'rotate-180' : ''}`} />
                </button>
                {open === i && (
                  <div className="px-5 pb-5 text-dark-300 text-sm leading-relaxed animate-slide-down">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
