import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      children,
      icon,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-md transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none";

    const variantStyles = {
      primary:
        "bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-hover)] focus-visible:ring-[var(--brand-primary)] shadow-subtle",
      secondary:
        "bg-[var(--surface-muted)] text-[var(--text-primary)] hover:bg-[var(--border-subtle)] focus-visible:ring-[var(--brand-primary)]",
      outline:
        "border border-[var(--border)] bg-transparent text-[var(--text-primary)] hover:bg-[var(--surface-muted)] focus-visible:ring-[var(--brand-primary)]",
      ghost:
        "bg-transparent text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] focus-visible:ring-[var(--brand-primary)]",
      danger:
        "bg-[var(--status-danger)] text-white hover:bg-red-700 focus-visible:ring-red-500 shadow-subtle",
    };

    const sizeStyles = {
      sm: "text-xs px-3 py-1.5 gap-1.5 min-h-[36px]",
      md: "text-sm px-4 py-2.5 gap-2 min-h-[44px]",
      lg: "text-base px-6 py-3.5 gap-2.5 min-h-[48px]",
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        <span>{children}</span>
      </button>
    );
  }
);

Button.displayName = "Button";
