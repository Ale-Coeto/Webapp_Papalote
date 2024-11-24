import { cn } from "~/lib/utils";

export const MainTitle = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => {
  return (
    <div className={cn("text-4xl font-semibold text-gris", className)}>
      <h1>{text}</h1>
    </div>
  );
};
