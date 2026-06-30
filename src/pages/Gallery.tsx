import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { GalleryItem } from '../types';

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [filter, setFilter] = useState('all');
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  useEffect(() => {
    supabase.from('gallery').select('*').order('created_at', { ascending: false }).then(({ data }) => setItems(data as GalleryItem[] ?? []));
  }, []);

  const categories = ['all', ...Array.from(new Set(items.map((i) => i.category)))];
  const filtered = filter === 'all' ? items : items.filter((i) => i.category === filter);

  return (
    <div className="pt-20 animate-fade-in">
      <section className="relative h-[35vh] flex items-center justify-center overflow-hidden">
        <img src="https://images.pexels.com/photos/3768916/pexels-photo-3768916.jpeg?auto=compress&cs=tinysrgb&w=1920" alt="Gallery" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-dark-950/80" />
        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">Our <span className="text-gradient">Gallery</span></h1>
          <p className="text-dark-300 max-w-2xl mx-auto px-4">Take a look inside our world-class facility.</p>
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

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => setLightbox(item)}
                className="card card-hover group cursor-pointer relative h-64 overflow-hidden"
              >
                <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <span className="badge bg-primary-600/80 text-white mb-2 capitalize">{item.category}</span>
                  <h3 className="text-lg font-bold text-white">{item.title}</h3>
                  <p className="text-sm text-dark-300 line-clamp-1">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-50 bg-dark-950/95 flex items-center justify-center p-4 animate-fade-in"
        >
          <button className="absolute top-4 right-4 p-2 text-white hover:bg-dark-800 rounded-lg">
            <X className="w-6 h-6" />
          </button>
          <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <img src={lightbox.image_url} alt={lightbox.title} className="w-full max-h-[80vh] object-contain rounded-lg" />
            <div className="mt-4 text-center">
              <h3 className="text-xl font-bold text-white">{lightbox.title}</h3>
              <p className="text-dark-400">{lightbox.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
