import React from 'react';
import { useInView } from '../hooks/useInView';

interface AnimateInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'left' | 'right' | 'none';
}

export function AnimateIn({ children, className = '', delay = 0, direction = 'up' }: AnimateInProps) {
  const { ref, inView } = useInView();

  const transforms = {
    up: 'translateY(24px)',
    left: 'translateX(-24px)',
    right: 'translateX(24px)',
    none: 'none'
  };

  const style: React.CSSProperties = {
    opacity: inView ? 1 : 0,
    transform: inView ? 'none' : transforms[direction],
    transition: `opacity 600ms cubic-bezier(0.16, 1, 0.3, 1), transform 600ms cubic-bezier(0.16, 1, 0.3, 1)`,
    transitionDelay: `${delay}ms`,
    willChange: 'opacity, transform'
  };

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className={className} style={style}>
      {children}
    </div>
  );
}
