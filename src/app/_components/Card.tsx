import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export default function Card({ children, ...props }: CardProps) {
  return (
    <div className="rounded-md bg-white p-6 shadow-md" {...props}>
      {children}
    </div>
  );
}
