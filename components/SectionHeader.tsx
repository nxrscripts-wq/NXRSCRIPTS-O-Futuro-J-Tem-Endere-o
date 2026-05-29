import React from 'react';
import { AnimateIn } from './AnimateIn';

interface Props {
  title: string;
  subtitle: string;
  align?: 'left' | 'center';
}

export const SectionHeader: React.FC<Props> = ({ title, subtitle, align = 'center' }) => {
  return (
    <div className={`mb-16 ${align === 'center' ? 'text-center' : 'text-left'}`}>
      <AnimateIn direction="up">
        <h2 className="text-nxr-primary font-mono text-sm tracking-widest uppercase mb-3">
          // {title}
        </h2>
      </AnimateIn>
      <AnimateIn delay={100}>
        <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
          {subtitle}
        </h3>
      </AnimateIn>
      <AnimateIn delay={200}>
        <div className={`h-1 w-20 bg-nxr-primary mt-6 ${align === 'center' ? 'mx-auto' : ''} rounded-full opacity-50`}></div>
      </AnimateIn>
    </div>
  );
};