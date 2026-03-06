import React from 'react';
import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: boolean;
  centered?: boolean;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className,
  size = 'lg',
  padding = true,
  centered = false,
}) => {
  const sizeClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    full: 'max-w-full',
  };

  return (
    <div
      className={cn(
        'w-full',
        sizeClasses[size],
        padding && 'px-4 sm:px-6 lg:px-8',
        centered && 'mx-auto',
        className
      )}
    >
      {children}
    </div>
  );
};

interface FluidContainerProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
}

export const FluidContainer: React.FC<FluidContainerProps> = ({
  children,
  className,
  padding = true,
}) => {
  return (
    <div
      className={cn(
        'w-full',
        padding && 'px-4 sm:px-6 lg:px-8',
        className
      )}
    >
      {children}
    </div>
  );
};

interface NarrowContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const NarrowContainer: React.FC<NarrowContainerProps> = ({
  children,
  className,
}) => {
  return (
    <div className={cn('mx-auto max-w-3xl px-4 sm:px-6 lg:px-8', className)}>
      {children}
    </div>
  );
};

export default Container;
export { cn };
