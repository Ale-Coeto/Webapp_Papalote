import React from "react";
import { cn } from "~/lib/utils";

interface CircleProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Circle = ({ children, className, ...props }: CircleProps) => {
  return (
    <div
      className={cn(
        "h-10 w-10 rounded-full border-4 border-gris bg-gray-300",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
