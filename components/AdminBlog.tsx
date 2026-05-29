import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAllPosts, createPost, updatePost, togglePublished, deletePost } from '../services/blogService';
import { BlogPost, BlogCategory } from '../types';
import { FileText, Plus, Trash2, Edit, Save, X, Eye, EyeOff, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES: BlogCategory[] = ['Cibersegurança', 'Desenvolvimento', 'Angola Tech', 'Tendências'];

const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const AdminBlog: React.FC = () => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentPost, setCurrentPost] = useState<Partial<BlogPost>>({});

  const { data: posts = [], isLoading, refetch } = useQuery({
    queryKey: ['admin-blog'],
    queryFn: fetchAllPosts,
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<BlogPost>) => createPost(data as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog'] });
      toast.success('Artigo criado com sucesso');
      setIsEditing(false);
      setCurrentPost({});
    },
    onError: () => toast.error('Erro ao criar artigo'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BlogPost> }) => updatePost(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog'] });
      toast.success('Artigo atualizado');
      setIsEditing(false);
      setCurrentPost({});
    },
    onError: () => toast.error('Erro ao atualizar artigo'),
  });

  const publishMutation = useMutation({
    mutationFn: ({ id, published }: { id: string; published: boolean }) => togglePublished(id, published),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-blog'] }),
    onError: () => toast.error('Erro ao alterar visibilidade'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog'] });
      toast.success('Artigo eliminado');
    },
    onError: () => toast.error('Erro ao eliminar artigo'),
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPost.title || !currentPost.content || !currentPost.category) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }
    
    // Auto-generate slug if not provided
    const payload = {
      ...currentPost,
      slug: currentPost.slug || slugify(currentPost.title)
    };

    if (currentPost.id) {
      updateMutation.mutate({ id: currentPost.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  if (isEditing) {
    return (
      <div className="bg-nxr-panel border border-nxr-border rounded-lg p-6">
        <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
          <h2 className="text-xl font-bold text-white font-rajdhani flex items-center">
            {currentPost.id ? <Edit className="w-5 h-5 mr-2 text-nxr-primary" /> : <Plus className="w-5 h-5 mr-2 text-nxr-primary" />}
            {currentPost.id ? 'Editar Artigo' : 'Novo Artigo'}
          </h2>
          <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-2 uppercase">Título *</label>
              <input 
                required 
                type="text"
                value={currentPost.title || ''} 
                onChange={e => setCurrentPost({...currentPost, title: e.target.value, slug: slugify(e.target.value)})}
                className="w-full bg-slate-950 border border-slate-800 text-white px-4 py-2 focus:border-cyan-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-2 uppercase">Slug</label>
              <input 
                required 
                type="text"
                value={currentPost.slug || ''} 
                onChange={e => setCurrentPost({...currentPost, slug: e.target.value})}
                className="w-full bg-slate-900 border border-slate-800 text-slate-500 px-4 py-2 cursor-not-allowed"
                readOnly
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-2 uppercase">Categoria *</label>
              <select
                required
                value={currentPost.category || ''}
                onChange={e => setCurrentPost({...currentPost, category: e.target.value as BlogCategory})}
                className="w-full bg-slate-950 border border-slate-800 text-white px-4 py-2 focus:border-cyan-400 transition-colors"
              >
                <option value="" disabled>Selecionar...</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-2 uppercase">Tempo de Leitura (min)</label>
              <input 
                type="number"
                min="1"
                value={currentPost.reading_time_minutes || 5} 
                onChange={e => setCurrentPost({...currentPost, reading_time_minutes: parseInt(e.target.value)})}
                className="w-full bg-slate-950 border border-slate-800 text-white px-4 py-2 focus:border-cyan-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-2 uppercase">URL da Imagem de Capa</label>
              <input 
                type="text"
                placeholder="https://..."
                value={currentPost.cover_image || ''} 
                onChange={e => setCurrentPost({...currentPost, cover_image: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 text-white px-4 py-2 focus:border-cyan-400 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-2 uppercase">Resumo (Excerpt) *</label>
            <textarea 
              required rows={2}
              value={currentPost.excerpt || ''} 
              onChange={e => setCurrentPost({...currentPost, excerpt: e.target.value})}
              className="w-full bg-slate-950 border border-slate-800 text-white px-4 py-2 focus:border-cyan-400 transition-colors"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-2 uppercase flex justify-between">
              <span>Conteúdo (Markdown suportado) *</span>
              <a href="https://www.markdownguide.org/cheat-sheet/" target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">Guia de Markdown</a>
            </label>
            <textarea 
              required rows={15}
              value={currentPost.content || ''} 
              onChange={e => setCurrentPost({...currentPost, content: e.target.value})}
              className="w-full bg-slate-950 border border-slate-800 text-white px-4 py-4 focus:border-cyan-400 transition-colors font-mono text-sm"
              placeholder="# Título Principal&#10;&#10;Escreva o seu conteúdo aqui..."
            ></textarea>
          </div>

          <div className="flex justify-end gap-4 border-t border-slate-800 pt-6">
            <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2 border border-slate-700 text-slate-300 hover:text-white transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="px-6 py-2 bg-cyan-400 text-slate-950 font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors flex items-center disabled:opacity-50">
              <Save className="w-4 h-4 mr-2" />
              {currentPost.id ? 'Atualizar Artigo' : 'Publicar Artigo'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white font-rajdhani flex items-center">
          <FileText className="mr-2 text-nxr-primary" />
          Gestão de Blog
        </h2>
        <button 
          onClick={() => { setCurrentPost({}); setIsEditing(true); }}
          className="flex items-center px-4 py-2 bg-nxr-primary text-nxr-dark font-bold text-sm hover:bg-cyan-300 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Artigo
        </button>
      </div>

      <div className="bg-nxr-panel border border-nxr-border overflow-hidden rounded-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-slate-900/50 text-xs uppercase font-mono text-slate-500 border-b border-nxr-border">
              <tr>
                <th className="px-6 py-4">Artigo</th>
                <th className="px-6 py-4">Categoria</th>
                <th className="px-6 py-4">Data de Criação</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-nxr-border">
              {isLoading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">A carregar artigos...</td></tr>
              ) : posts.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">Nenhum artigo encontrado. Crie o primeiro!</td></tr>
              ) : (
                posts.map(post => (
                  <tr key={post.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white mb-1">{post.title}</div>
                      <div className="text-xs font-mono text-slate-500 truncate max-w-xs">{post.slug}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-slate-800 text-cyan-400 text-xs rounded">{post.category}</span>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono">
                      {new Date(post.created_at).toLocaleDateString('pt-PT')}
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => publishMutation.mutate({ id: post.id, published: !post.published })}
                        className={`flex items-center text-xs px-2 py-1 rounded border transition-colors ${
                          post.published ? 'text-green-400 border-green-900 bg-green-900/20 hover:bg-green-900/40' : 'text-slate-400 border-slate-700 bg-slate-800 hover:bg-slate-700'
                        }`}
                      >
                        {post.published ? <><Eye className="w-3 h-3 mr-1" /> Publicado</> : <><EyeOff className="w-3 h-3 mr-1" /> Rascunho</>}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => { setCurrentPost(post); setIsEditing(true); }}
                        className="text-slate-400 hover:text-cyan-400 transition-colors mr-3"
                        title="Editar Artigo"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => { if(confirm('Tem a certeza que deseja eliminar este artigo?')) deleteMutation.mutate(post.id); }}
                        className="text-slate-400 hover:text-red-500 transition-colors"
                        title="Eliminar Artigo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
