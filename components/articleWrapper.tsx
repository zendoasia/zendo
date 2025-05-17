import { ArticleWrapperProps } from "@/types";
import { cn } from "@/lib/utils";

export default function ArticleWrapper({ children, className = "" }: ArticleWrapperProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center min-h-screen text-base app-font",
        className
      )}
    >
      {children}
    </div>
  );
}
