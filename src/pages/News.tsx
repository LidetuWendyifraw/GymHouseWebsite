import { useEffect, useState } from 'react';
import { Calendar, Tag } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Announcement } from '../types';

export default function News() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    supabase.from('announcements').select('*').eq('is_published', true).order('published_at', { ascending: false }).then(({ data }) => setAnnouncements(data as Announcement[] ?? []));
  }, []);

  const categories = ['all', ...Array.from(new Set(announcements.map((a) => a.category)))];
  const filtered = filter === 'all' ? announcements : announcements.filter((a) => a.category === filter);

  return (
    <div className="pt-20 animate-fade-in">
      <section className="relative h-[35vh] flex items-center justify-center overflow-hidden">
        <img src="https://images.pexels.com/photos/4753986/pexels-photo-4753986.jpeg?auto=compress&cs=tinysrgb&w=1920" alt="News" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-dark-950/80" />
        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">News & <span className="text-gradient">Announcements</span></h1>
          <p className="text-dark-300 max-w-2xl mx-auto px-4">Stay updated with the latest from Gym House.</p>
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
                {cat.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((a) => (
              <article key={a.id} className="card card-hover overflow-hidden">
                {a.image_url ? (
                  <div className="h-48 overflow-hidden">
                    <img src={a.image_url} alt={a.title} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-primary-900 to-dark-800 flex items-center justify-center">
                    <Tag className="w-12 h-12 text-primary-600" />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="badge bg-primary-600/20 text-primary-400 capitalize">{a.category.replace('_', ' ')}</span>
                    <span className="text-xs text-dark-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(a.published_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{a.title}</h3>
                  <p className="text-sm text-dark-400 leading-relaxed">{a.content}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
