import React from 'react';
import { cn } from '~/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export default function Card({ children, className, ...props }: CardProps) {
  return (
    <div className={cn("rounded-md bg-white p-6 shadow-md", className)} {...props}>
      {children}
    </div>
  );
}
