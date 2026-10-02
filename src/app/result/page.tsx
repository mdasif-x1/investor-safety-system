import React from "react";
import Link from "next/link";
import { ArrowLeft, AlertTriangle, ShieldCheck, HelpCircle, ArrowRight, ExternalLink } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge, SeverityBadge, EvidenceBadge } from "@/components/ui/Badge";

export default function ResultPlaceholderPage() {
  return (
    <div className="py-10">
      <Container size="default">
        <div className="flex flex-col gap-8">
          <div>
            <Link
              href="/check"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--brand-primary)] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Submission</span>
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-6">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Badge variant="brand">Golden Result Structure Placeholder</Badge>
                <span className="text-xs text-[var(--text-muted)]">Phase 3 Full Implementation Target</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--brand-primary)]">
                Safety Analysis &amp; Evidence Report
              </h1>
            </div>
            <SeverityBadge severity="HIGH" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card variant="elevated" className="md:col-span-2 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <h2 className="text-lg font-bold text-[var(--brand-primary)] flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <span>Detected Warning Signals</span>
                </h2>
                <p className="text-xs text-[var(--text-muted)]">
                  Deterministic rules matching known WhatsApp/Telegram advisory scam patterns.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <div className="p-4 rounded border border-red-200 bg-red-50/60 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-red-900">Guaranteed Return Promise</span>
                    <Badge variant="danger" size="sm">Critical Risk</Badge>
                  </div>
                  <p className="text-xs text-red-800 leading-relaxed">
                    SEBI regulations prohibit guaranteed returns on equity or derivative advisory. Equity investments carry inherent market risks.
                  </p>
                </div>

                <div className="p-4 rounded border border-amber-200 bg-amber-50/60 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-amber-900">Unregistered Research Analyst Claim</span>
                    <Badge variant="warning" size="sm">High Caution</Badge>
                  </div>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    No matching registration found under SEBI SCORES portal for entity name provided.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--border)] flex flex-col gap-2">
                <h3 className="text-sm font-bold text-[var(--brand-primary)] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Evidence Registry Status</span>
                </h3>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded flex items-center justify-between text-xs">
                  <span>Official SEBI Intermediary Registry</span>
                  <EvidenceBadge status="CONTRADICTED" />
                </div>
              </div>
            </Card>

            <Card variant="bordered" className="flex flex-col gap-4 bg-[var(--surface-muted)]">
              <h2 className="text-base font-bold text-[var(--brand-primary)] flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-sky-600" />
                <span>Safer Next Actions</span>
              </h2>
              <ul className="flex flex-col gap-3 text-xs text-[var(--text-secondary)]">
                <li className="p-3 bg-white rounded border border-[var(--border)] flex flex-col gap-1">
                  <strong className="text-[var(--text-primary)]">1. Do Not Transfer Funds</strong>
                  <span>Never pay joining fees for VIP Telegram or WhatsApp stock tip channels.</span>
                </li>
                <li className="p-3 bg-white rounded border border-[var(--border)] flex flex-col gap-1">
                  <strong className="text-[var(--text-primary)]">2. Check SCORES Portal</strong>
                  <span>Verify research analyst registration on official SEBI database.</span>
                </li>
              </ul>
              <a
                href="https://scores.sebi.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto pt-2"
              >
                <Button variant="outline" size="sm" className="w-full justify-between text-xs bg-white">
                  <span>Verify on SEBI SCORES</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Button>
              </a>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}
