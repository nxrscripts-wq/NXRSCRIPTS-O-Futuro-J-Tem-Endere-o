import { supabase } from '../lib/supabase';
import type { Product, NewProduct, Order, NewOrder } from '../types';

const WHATSAPP_NUMBER = '244923479049'; // número real NXRSCRIPTS sem + nem espaços

// ================================================================
// PRODUTOS — PÚBLICO
// ================================================================

export async function fetchActiveProducts(category?: string): Promise<Product[]> {
  let q = supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .order('sort_order', { ascending: false })
    .order('created_at', { ascending: false });

  if (category && category !== 'Todos') {
    q = q.eq('category', category);
  }

  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function fetchFeaturedProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .eq('featured', true)
    .order('sort_order', { ascending: false })
    .limit(6);

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function fetchProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .eq('active', true)
    .single();

  if (error?.code === 'PGRST116') return null; // not found
  if (error) throw new Error(error.message);
  return data;
}

export function buildWhatsAppLink(product: Product, quantity = 1): string {
  const productInfo = product.price
    ? `*${product.name}* — ${product.currency === 'USD' ? '$' : 'Kz '}${product.price.toLocaleString('pt-AO')}`
    : `*${product.name}* — Consultar preço`;

  const message = encodeURIComponent(
    `Olá NXRSCRIPTS! 👋\n\nTenho interesse no seguinte produto:\n\n${productInfo}\nQuantidade: ${quantity}\n\nPoderia dar-me mais informações sobre disponibilidade e condições de compra?\n\nObrigado!`,
  );

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
}

// ================================================================
// REQUISIÇÕES — PÚBLICO
// ================================================================

export async function createOrder(order: NewOrder): Promise<void> {
  const { error } = await supabase.from('orders').insert(order);
  if (error) throw new Error(error.message);
}

// ================================================================
// PRODUTOS — ADMIN
// ================================================================

export async function fetchAllProductsAdmin(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createProduct(product: NewProduct): Promise<Product> {
  const { data, error } = await supabase.from('products').insert(product).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<void> {
  const { error } = await supabase.from('products').update(updates).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function deleteProduct(id: string): Promise<void> {
  // Primeiro buscar imagens para apagar do storage
  const { data: product } = await supabase
    .from('products')
    .select('images, cover_image')
    .eq('id', id)
    .single();

  if (product?.images?.length) {
    const paths = product.images
      .map((url: string) => url.split('/product-images/')[1])
      .filter(Boolean);
    if (paths.length) {
      await supabase.storage.from('product-images').remove(paths);
    }
  }

  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function toggleProductActive(id: string, active: boolean): Promise<void> {
  const { error } = await supabase.from('products').update({ active }).eq('id', id);
  if (error) throw new Error(error.message);
}

// ================================================================
// STORAGE — Upload & Delete de Imagens
// ================================================================

export async function uploadProductImage(file: File, productId: string): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const path = `${productId}/${Date.now()}.${ext}`;

  const { error } = await supabase.storage.from('product-images').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from('product-images').getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteProductImage(url: string): Promise<void> {
  const path = url.split('/product-images/')[1];
  if (!path) return;
  const { error } = await supabase.storage.from('product-images').remove([path]);
  if (error) throw new Error(error.message);
}

// ================================================================
// REQUISIÇÕES — ADMIN
// ================================================================

export async function fetchAllOrdersAdmin(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*, products(name, cover_image)')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function updateOrderStatus(id: string, status: Order['status']): Promise<void> {
  const { error } = await supabase.from('orders').update({ status }).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function updateOrderNotes(id: string, notes: string): Promise<void> {
  const { error } = await supabase.from('orders').update({ notes }).eq('id', id);
  if (error) throw new Error(error.message);
}

// ================================================================
// HELPERS
// ================================================================

export function formatPrice(product: Product): string {
  if (!product.price) return 'Consulte-nos';
  const formatter = new Intl.NumberFormat('pt-AO', { minimumFractionDigits: 0 });
  return product.currency === 'USD'
    ? `$${formatter.format(product.price)}`
    : `Kz ${formatter.format(product.price)}`;
}

export function getCategoryList(): string[] {
  return [
    'Todos',
    'Informática',
    'Redes',
    'Servidor',
    'Segurança',
    'Telecom',
    'Software',
    'Periféricos',
    'Setups',
    'Outros',
  ];
}
