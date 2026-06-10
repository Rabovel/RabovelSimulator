import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, type ReactNode } from "react";

export function Button({
  className,
  variant = "primary",
  size = "md",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
        variant === "primary" && "bg-primary text-white hover:bg-primary-dark",
        variant === "secondary" && "bg-surface border border-border hover:bg-surface-hover",
        variant === "ghost" && "hover:bg-surface-hover text-muted hover:text-foreground",
        variant === "danger" && "bg-danger/20 text-danger hover:bg-danger/30",
        size === "sm" && "px-3 py-1.5 text-sm",
        size === "md" && "px-4 py-2 text-sm",
        size === "lg" && "px-6 py-3",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-surface border border-border rounded-xl p-6",
        className
      )}
    >
      {children}
    </div>
  );
}

export function Badge({
  children,
  variant = "default",
}: {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "danger";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variant === "default" && "bg-surface-hover text-muted",
        variant === "success" && "bg-accent/15 text-accent",
        variant === "warning" && "bg-warning/20 text-warning",
        variant === "danger" && "bg-danger/20 text-danger"
      )}
    >
      {children}
    </span>
  );
}

export function StatCard({
  label,
  value,
  sub,
  icon,
}: {
  label: string;
  value: string;
  sub?: string;
  icon?: ReactNode;
}) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted">{label}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
          {sub && <p className="text-xs text-muted mt-1">{sub}</p>}
        </div>
        {icon && (
          <div className="p-2 rounded-lg bg-primary/10 text-primary">{icon}</div>
        )}
      </div>
    </Card>
  );
}

export function Input({
  label,
  error,
  hint,
  ...props
}: {
  label?: string;
  error?: string;
  hint?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-sm font-medium text-foreground">{label}</label>
      )}
      <input
        {...props}
        className={cn(error && "border-danger focus:border-danger", props.className)}
        aria-invalid={error ? true : undefined}
      />
      {hint && !error && <p className="text-xs text-muted">{hint}</p>}
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin",
        className
      )}
      aria-hidden
    />
  );
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {description && <p className="text-muted mt-1">{description}</p>}
      </div>
      {action}
    </div>
  );
}
