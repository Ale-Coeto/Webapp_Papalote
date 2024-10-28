import { IoIosAdd } from "react-icons/io";

import * as React from "react";

import { cn } from "~/lib/utils";

interface AddButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  onClick: () => void;
  iconClassName?: string;
  buttonClassName?: string;
}

export default function AddButton({
  onClick,
  className,
  iconClassName,
  buttonClassName,
  ...divProps
}: AddButtonProps) {
  return (
    <div className={cn("flex justify-end", className)} {...divProps}>
      <button
        onClick={onClick}
        className={cn(
          "rounded-full border-2 p-1 shadow-sm hover:bg-slate-50",
          buttonClassName,
        )}
      >
        <IoIosAdd className={cn("text-3xl text-gris", iconClassName)} />
      </button>
    </div>
  );
}
