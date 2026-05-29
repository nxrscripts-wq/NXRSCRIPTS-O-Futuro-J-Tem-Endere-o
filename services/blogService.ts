import { BlogPost } from '../types';
import { supabase } from '../lib/supabase';
import { isValidUUID } from '../lib/security';

export const fetchPublishedPosts = async (category?: string): Promise<BlogPost[]> => {
  let query = supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false });

  if (category && category !== 'Todos') {
    query = query.eq('category', category);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }

  return data || [];
};

export const fetchPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching blog post by slug:', error);
    return null;
  }

  return data;
};

// Admin Functions

export const fetchAllPosts = async (): Promise<BlogPost[]> => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all blog posts:', error);
    return [];
  }

  return data || [];
};

export const createPost = async (postData: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>): Promise<BlogPost | null> => {
  const { data, error } = await supabase
    .from('blog_posts')
    .insert([postData])
    .select()
    .single();

  if (error) {
    console.error('Error creating blog post:', error);
    return null;
  }

  return data;
};

export const updatePost = async (id: string, postData: Partial<Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>>): Promise<boolean> => {
  if (!isValidUUID(id)) return false;

  const { error } = await supabase
    .from('blog_posts')
    .update({ ...postData, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    console.error('Error updating blog post:', error);
    return false;
  }

  return true;
};

export const togglePublished = async (id: string, published: boolean): Promise<boolean> => {
  if (!isValidUUID(id)) return false;

  const published_at = published ? new Date().toISOString() : null;

  const { error } = await supabase
    .from('blog_posts')
    .update({ published, published_at, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    console.error('Error toggling publish state:', error);
    return false;
  }

  return true;
};

export const deletePost = async (id: string): Promise<boolean> => {
  if (!isValidUUID(id)) return false;

  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting blog post:', error);
    return false;
  }

  return true;
};
