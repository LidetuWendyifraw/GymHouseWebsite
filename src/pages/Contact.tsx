import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSent(false), 5000);
  };

  const contactInfo = [
    { icon: MapPin, label: 'Address', value: '123 Fitness Avenue, Downtown District, New York, NY 10001' },
    { icon: Phone, label: 'Phone', value: '+1 (555) 123-4567' },
    { icon: Mail, label: 'Email', value: 'info@gymhouse.com' },
    { icon: Clock, label: 'Hours', value: 'Mon-Fri: 5am-11pm, Sat: 6am-10pm, Sun: 7am-9pm' },
  ];

  return (
    <div className="pt-20 animate-fade-in">
      <section className="relative h-[35vh] flex items-center justify-center overflow-hidden">
        <img src="https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=1920" alt="Contact" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-dark-950/80" />
        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">Get in <span className="text-gradient">Touch</span></h1>
          <p className="text-dark-300 max-w-2xl mx-auto px-4">We'd love to hear from you. Reach out with any questions.</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-max grid lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">Contact Information</h2>
            <div className="space-y-4 mb-8">
              {contactInfo.map((info, i) => (
                <div key={i} className="card p-4 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-600/20 flex items-center justify-center shrink-0">
                    <info.icon className="w-6 h-6 text-primary-400" />
                  </div>
                  <div>
                    <p className="text-sm text-dark-400 mb-1">{info.label}</p>
                    <p className="text-white">{info.value}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="card overflow-hidden h-64">
              <iframe
                title="Gym Location"
                src="https://www.openstreetmap.org/export/embed.html?bbox=-74.01,40.71,-73.99,40.72&layer=mapnik"
                className="w-full h-full border-0"
              />
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-white mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="card p-6 space-y-4">
              {sent && (
                <div className="flex items-center gap-2 p-3 bg-primary-600/20 text-primary-400 rounded-lg animate-slide-down">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-sm">Message sent! We'll get back to you soon.</span>
                </div>
              )}
              <div>
                <label className="block text-sm text-dark-300 mb-1.5">Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-field"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm text-dark-300 mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input-field"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm text-dark-300 mb-1.5">Subject</label>
                <input
                  type="text"
                  required
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="input-field"
                  placeholder="What's this about?"
                />
              </div>
              <div>
                <label className="block text-sm text-dark-300 mb-1.5">Message</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="input-field resize-none"
                  placeholder="Your message..."
                />
              </div>
              <button type="submit" className="btn-primary w-full">
                Send Message
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
