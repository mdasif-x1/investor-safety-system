import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "flat" | "bordered";
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  variant = "default",
}) => {
  const variantStyles = {
    default: "bg-[var(--surface)] border border-[var(--border)] shadow-card",
    elevated: "bg-[var(--surface)] border border-[var(--border)] shadow-elevated",
    flat: "bg-[var(--surface-muted)] border border-transparent",
    bordered: "bg-[var(--surface)] border-2 border-[var(--border-subtle)]",
  };

  return (
    <div className={`rounded-lg p-5 sm:p-6 transition-all ${variantStyles[variant]} ${className}`}>
      {children}
    </div>
  );
};
