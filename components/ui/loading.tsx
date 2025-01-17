import { Loader2 } from "lucide-react";
import { cn } from "~/libs/utils";

interface LoadingProps {
  className?: string;
  text?: string;
}

export function Loading({ className, text = "加载中..." }: LoadingProps) {
  return (
    <div className={cn("flex items-center justify-center space-x-2", className)}>
      <Loader2 className="h-5 w-5 animate-spin" />
      <span className="text-muted-foreground text-sm">{text}</span>
    </div>
  );
} 