export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
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
  createdAt: number;
}