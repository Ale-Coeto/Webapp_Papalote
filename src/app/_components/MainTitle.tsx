import { cn } from "~/lib/utils";

interface MainTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string;
}
export const MainTitle = ({ text, className, ...props }: MainTitleProps) => {
  return (
    <div
      className={cn("text-4xl font-semibold text-gris", className)}
      {...props}
    >
      <h1>{text}</h1>
    </div>
  );
};
