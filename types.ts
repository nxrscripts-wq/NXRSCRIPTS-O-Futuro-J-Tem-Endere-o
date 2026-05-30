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
