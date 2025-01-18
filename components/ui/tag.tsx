import { cn } from "@/lib/utils";

interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "outline";
}

export function Tag({
  children,
  variant = "default",
  className,
  ...props
}: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-1 text-sm font-medium ring-1 ring-inset",
        {
          "bg-primary/10 text-primary ring-primary/20": variant === "default",
          "bg-secondary text-secondary-foreground ring-secondary/20":
            variant === "secondary",
          "text-foreground ring-border": variant === "outline",
        },
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
} 