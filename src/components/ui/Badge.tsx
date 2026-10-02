import React from "react";
import { SignalSeverity, EvidenceStatus } from "@/types/analysis";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "neutral" | "success" | "warning" | "danger" | "info" | "brand";
  size?: "sm" | "md";
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "neutral",
  size = "md",
  icon,
  className = "",
}) => {
  const variantStyles = {
    neutral: "bg-[var(--surface-muted)] text-[var(--text-secondary)] border-[var(--border)]",
    success: "bg-[var(--status-success-bg)] text-[var(--status-success)] border-emerald-200",
    warning: "bg-[var(--status-warning-bg)] text-[var(--status-warning)] border-amber-200",
    danger: "bg-[var(--status-danger-bg)] text-[var(--status-danger)] border-red-200",
    info: "bg-[var(--status-info-bg)] text-[var(--status-info)] border-sky-200",
    brand: "bg-[var(--brand-light)] text-[var(--brand-primary)] border-slate-200",
  };

  const sizeStyles = {
    sm: "text-xs px-2 py-0.5 gap-1",
    md: "text-xs sm:text-sm px-2.5 py-1 gap-1.5 font-medium",
  };

  return (
    <span
      className={`inline-flex items-center rounded border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};

export const SeverityBadge: React.FC<{ severity: SignalSeverity }> = ({ severity }) => {
  const mapping: Record<SignalSeverity, { label: string; variant: BadgeProps["variant"] }> = {
    HIGH: { label: "High Risk Pattern", variant: "danger" },
    MEDIUM: { label: "Caution Pattern", variant: "warning" },
    LOW: { label: "Low Risk Pattern", variant: "info" },
    INFORMATIONAL: { label: "Informational", variant: "neutral" },
  };

  const config = mapping[severity];
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

export const EvidenceBadge: React.FC<{ status: EvidenceStatus }> = ({ status }) => {
  const mapping: Record<EvidenceStatus, { label: string; subtext: string; variant: BadgeProps["variant"] }> = {
    SUPPORTED: {
      label: "Official Record Match (Verified)",
      subtext: "Official source matches this claim",
      variant: "success",
    },
    UNVERIFIED: {
      label: "Unverified Claim (Abhi Verify Nahi Hua)",
      subtext: "Independent official proof is not established",
      variant: "warning",
    },
    CONTRADICTED: {
      label: "Mismatch with Official Source",
      subtext: "Authoritative records conflict with this statement",
      variant: "danger",
    },
    INSUFFICIENT_INFORMATION: {
      label: "Need Registration ID (Enough Details Nahi)",
      subtext: "Missing registration number to query official registry",
      variant: "info",
    },
    SOURCE_UNAVAILABLE: {
      label: "Official Portal Offline (Source Unavailable)",
      subtext: "Official registry could not be reached at this time",
      variant: "neutral",
    },
  };

  const config = mapping[status] || {
    label: status,
    subtext: "",
    variant: "neutral",
  };

  return (
    <div className="flex flex-col items-start gap-0.5">
      <Badge variant={config.variant}>{config.label}</Badge>
      {config.subtext && (
        <span className="text-[10px] text-[var(--text-muted)] italic pl-0.5">
          {config.subtext}
        </span>
      )}
    </div>
  );
};