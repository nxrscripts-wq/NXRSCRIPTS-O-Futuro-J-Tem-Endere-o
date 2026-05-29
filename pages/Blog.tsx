import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchPublishedPosts } from '../services/blogService';
import { BlogCategory } from '../types';
import { SEOHead } from '../components/SEOHead';
import { SEO_PAGES } from '../lib/seo';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { SectionHeader } from '../components/SectionHeader';
import { AnimateIn } from '../components/AnimateIn';

const CATEGORIES: ('Todos' | BlogCategory)[] = ['Todos', 'Cibersegurança', 'Desenvolvimento', 'Angola Tech', 'Tendências'];

const Blog: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('Todos');

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['blog', activeCategory],
    queryFn: () => fetchPublishedPosts(activeCategory),
  });

  return (
    <>
      <SEOHead page={SEO_PAGES.blog} />
      <div className="min-h-screen bg-nxr-dark pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <SectionHeader title="Blog" subtitle="Insights, Tendências e Tecnologia" />
          
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-12 justify-center">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-nxr-primary text-nxr-dark'
                    : 'bg-nxr-panel text-slate-400 border border-nxr-border hover:border-nxr-primary hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-nxr-panel border border-nxr-border rounded-lg overflow-hidden animate-pulse">
                  <div className="aspect-video bg-slate-800 w-full" />
                  <div className="p-6">
                    <div className="w-24 h-4 bg-slate-800 rounded-full mb-4" />
                    <div className="w-full h-6 bg-slate-800 rounded mb-2" />
                    <div className="w-3/4 h-6 bg-slate-800 rounded mb-4" />
                    <div className="w-full h-4 bg-slate-800 rounded mb-2" />
                    <div className="w-full h-4 bg-slate-800 rounded mb-6" />
                    <div className="flex justify-between items-center">
                      <div className="w-20 h-4 bg-slate-800 rounded" />
                      <div className="w-24 h-4 bg-slate-800 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, idx) => (
                <AnimateIn key={post.id} delay={idx * 100}>
                  <article className="bg-nxr-panel border border-nxr-border rounded-lg overflow-hidden group hover:border-nxr-primary transition-all duration-500 flex flex-col h-full relative">
                    <Link to={`/blog/${post.slug}`} className="absolute inset-0 z-10">
                      <span className="sr-only">Ler {post.title}</span>
                    </Link>
                    
                    {post.cover_image ? (
                      <div className="aspect-video w-full overflow-hidden">
                        <img 
                          src={post.cover_image} 
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                        />
                      </div>
                    ) : (
                      <div className="aspect-video w-full bg-slate-900 flex items-center justify-center border-b border-nxr-border">
                        <div className="font-orbitron text-3xl text-slate-800 select-none">NXRSCRIPTS</div>
                      </div>
                    )}
                    
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="mb-4">
                        <span className="inline-block px-3 py-1 bg-cyan-950/30 border border-cyan-900 text-cyan-400 text-xs font-mono uppercase tracking-wider rounded-full">
                          {post.category}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-nxr-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      
                      <p className="text-slate-400 text-sm mb-6 line-clamp-3 flex-grow">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-slate-500 font-mono mt-auto pt-4 border-t border-slate-800">
                        <div className="flex items-center">
                          <Calendar className="w-3.5 h-3.5 mr-1.5" />
                          {post.published_at ? new Date(post.published_at).toLocaleDateString('pt-PT', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-3.5 h-3.5 mr-1.5" />
                          {post.reading_time_minutes} min
                        </div>
                      </div>
                    </div>
                  </article>
                </AnimateIn>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-nxr-panel border border-nxr-border rounded-lg max-w-2xl mx-auto">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-slate-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Em Breve</h3>
              <p className="text-slate-400">Os primeiros insights e artigos chegam esta semana. Fica atento!</p>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default Blog;
