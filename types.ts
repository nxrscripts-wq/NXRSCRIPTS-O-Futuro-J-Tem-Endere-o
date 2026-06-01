export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  subServices?: string[];
}

export interface TechItem {
  name: string;
  category: string;
  description: string;
}

export interface NavigationItem {
  label: string;
  path: string;
}

export enum PageState {
  HOME = 'HOME',
  ABOUT = 'ABOUT',
  SERVICES = 'SERVICES',
  TECHNOLOGIES = 'TECHNOLOGIES',
  CONTACT = 'CONTACT',
}

export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CLOSED' | 'ARCHIVED';

export interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  message: string;
  category: string; // From AI analysis
  status: LeadStatus;
  notes?: string;
  createdAt: number;
}

export type BlogCategory = 'Cibersegurança' | 'Desenvolvimento' | 'Angola Tech' | 'Tendências';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: BlogCategory;
  tags: string[];
  cover_image: string | null;
  reading_time_minutes: number;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

// ---- STORE ----

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number | null;
  currency: 'AOA' | 'USD';
  category: string;
  stock_status: 'available' | 'out_of_stock' | 'on_request';
  featured: boolean;
  active: boolean;
  sort_order: number;
  images: string[];
  cover_image: string | null;
  specs: Record<string, string>;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export type NewProduct = Omit<Product, 'id' | 'created_at' | 'updated_at'>;

export interface Order {
  id: string;
  product_id: string | null;
  product_name: string;
  product_price: number | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  quantity: number;
  message: string | null;
  status: 'new' | 'contacted' | 'processing' | 'completed' | 'cancelled';
  source: 'form' | 'whatsapp';
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type NewOrder = Omit<Order, 'id' | 'created_at' | 'updated_at' | 'status' | 'notes'>;
