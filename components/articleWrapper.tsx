import { ArticleWrapperProps } from "@/types";
import { cn } from "@/lib/utils";

export default function ArticleWrapper({ children, className = "", style = null }: ArticleWrapperProps) {
  return (
    <div
      className={cn(
        "justify-center min-h-screen app-font flex flex-col",
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}
