"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface AnimatedIconProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'bounce' | 'pulse' | 'wiggle' | 'float' | 'glow';
  delay?: number;
}

export function AnimatedIcon({ 
  children, 
  className,
  animation = 'float',
  delay = 0 
}: AnimatedIconProps) {
  const animationClasses = {
    bounce: 'animate-bounce',
    pulse: 'animate-pulse',
    wiggle: 'animate-wiggle',
    float: 'animate-float',
    glow: 'animate-glow'
  };

  return (
    <div 
      className={cn(
        'transition-all duration-300 ease-in-out hover:scale-110',
        animationClasses[animation],
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// CSS animations are defined in globals.css
export default AnimatedIcon;
