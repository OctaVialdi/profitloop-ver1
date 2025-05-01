
import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  centered?: boolean;
}

const Spinner = ({ size = 'md', className, centered = false }: SpinnerProps) => {
  const sizeMap = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <div className={cn(
      centered && 'flex items-center justify-center w-full min-h-[100px]',
      className
    )}>
      <Loader2 
        className={cn(
          'animate-spin text-primary', 
          sizeMap[size]
        )} 
      />
    </div>
  );
};

export default Spinner;
