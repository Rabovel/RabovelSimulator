import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export function AlertBanner({
  variant = "error",
  children,
  className,
}: {
  variant?: "error" | "success" | "info";
  children: React.ReactNode;
  className?: string;
}) {
  const Icon =
    variant === "success" ? CheckCircle2 : variant === "info" ? Info : AlertCircle;

  return (
    <div
      role="alert"
      className={cn(
        "flex gap-3 rounded-xl px-4 py-3 text-sm",
        variant === "error" && "bg-danger/10 text-danger border border-danger/20",
        variant === "success" && "bg-accent/10 text-accent border border-accent/20",
        variant === "info" && "bg-primary/10 text-primary border border-primary/20",
        className
      )}
    >
      <Icon className="w-4 h-4 shrink-0 mt-0.5" />
      <div className="flex-1">{children}</div>
    </div>
  );
}
