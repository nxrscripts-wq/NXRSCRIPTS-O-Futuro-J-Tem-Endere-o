import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchPostBySlug } from '../services/blogService';
import { SEOHead } from '../components/SEOHead';
import { Calendar, Clock, ArrowLeft, Tag } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: () => fetchPostBySlug(slug as string),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 pt-32 pb-24 flex justify-center items-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mb-4" />
          <div className="text-cyan-400 font-mono text-sm tracking-widest uppercase">
            A decifrar dados...
          </div>
        </div>
      </div>
    );
  }

  if (!post || !post.published) {
    return <Navigate to="/404" replace />;
  }

  return (
    <>
      <SEOHead
        page={{
          title: `${post.title} | Blog NXRSCRIPTS`,
          description: post.excerpt,
          path: `/blog/${post.slug}`,
          ogType: 'article',
        }}
      />

      <div className="min-h-screen bg-slate-950 pt-24 pb-24">
        <article className="max-w-3xl mx-auto px-4 sm:px-6">
          <Link
            to="/blog"
            className="inline-flex items-center text-slate-400 hover:text-cyan-400 font-mono text-xs uppercase tracking-widest mb-10 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Blog
          </Link>

          {/* Header */}
          <header className="mb-10">
            <div className="mb-6 flex flex-wrap gap-2">
              <span className="inline-block px-3 py-1 bg-cyan-950/30 border border-cyan-900 text-cyan-400 text-xs font-mono uppercase tracking-wider rounded-full">
                {post.category}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight font-rajdhani">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400 font-mono border-y border-slate-800 py-4">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-slate-500" />
                {post.published_at
                  ? new Date(post.published_at).toLocaleDateString('pt-PT', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })
                  : 'N/A'}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-slate-500" />
                {post.reading_time_minutes} min de leitura
              </div>
            </div>
          </header>

          {/* Cover Image */}
          {post.cover_image && (
            <div className="w-full aspect-video rounded-lg overflow-hidden border border-slate-800 mb-12">
              <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Content (Manual typography styles matching cyber theme) */}
          <div
            className="text-slate-300 leading-relaxed text-lg 
            /* Markdown Styling Overrides */
            [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-white [&>h2]:mt-12 [&>h2]:mb-6 [&>h2]:font-orbitron [&>h2]:tracking-wider
            [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-cyan-400 [&>h3]:mt-8 [&>h3]:mb-4 [&>h3]:font-rajdhani
            [&>p]:mb-6 
            [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>ul>li]:mb-2 [&>ul>li::marker]:text-cyan-500
            [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-6 [&>ol>li]:mb-2 [&>ol>li::marker]:text-cyan-500
            [&>blockquote]:border-l-4 [&>blockquote]:border-cyan-500 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-slate-400 [&>blockquote]:bg-slate-900/50 [&>blockquote]:py-2 [&>blockquote]:pr-4 [&>blockquote]:rounded-r [&>blockquote]:my-8
            [&>pre]:bg-slate-900 [&>pre]:border [&>pre]:border-slate-800 [&>pre]:p-4 [&>pre]:rounded-lg [&>pre]:overflow-x-auto [&>pre]:mb-6 [&>pre]:text-sm
            [&_code]:font-mono [&_code]:text-cyan-300 [&_code]:bg-slate-900 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm
            [&>pre_code]:bg-transparent [&>pre_code]:p-0 [&>pre_code]:text-slate-300
            [&_a]:text-cyan-400 [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-cyan-300
          "
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
          </div>

          {/* Footer & Tags */}
          <footer className="mt-16 pt-8 border-t border-slate-800">
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-10">
                <Tag className="w-4 h-4 text-slate-500 mr-2" />
                {post.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <Link
              to="/blog"
              className="inline-flex items-center px-6 py-3 bg-cyan-400 text-slate-950 font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Explorar Mais Artigos
            </Link>
          </footer>
        </article>
      </div>
    </>
  );
};

export default BlogPost;
