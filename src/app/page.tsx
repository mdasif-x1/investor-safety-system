import React from "react";
import Link from "next/link";
import {
  ShieldAlert,
  ArrowRight,
  Search,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Lock,
  FileText,
  ShieldCheck,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge, SeverityBadge } from "@/components/ui/Badge";
import { SITE_CONFIG } from "@/config/site";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-16 py-10 sm:py-14">
      {/* Editorial Hero Section */}
      <section>
        <Container size="default">
          <div className="flex flex-col items-center text-center gap-6 max-w-3xl mx-auto">
            <Badge variant="brand" icon={<ShieldAlert className="w-4 h-4 text-[var(--accent-saffron)]" />}>
              SANGYAN Public Investor Resilience Project
            </Badge>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--brand-primary)] leading-[1.15]">
              Before money or action moves, check what you are seeing.
            </h1>

            <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed font-normal">
              Received a suspicious stock tip on WhatsApp, Telegram, or Instagram? Paste the claim or screenshot to detect warning signals, inspect verified evidence, and take a safer next step.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 w-full justify-center">
              <Link href="/check" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" icon={<ArrowRight className="w-5 h-5" />} className="w-full sm:w-auto">
                  Check a Financial Message Now
                </Button>
              </Link>
              <a href="#how-it-works" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  How Safety Check Works
                </Button>
              </a>
            </div>

            {/* Public Safety Guarantee */}
            <div className="flex items-center justify-center gap-6 pt-4 text-xs text-[var(--text-muted)] border-t border-[var(--border)] w-full max-w-xl">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-600" /> No password / OTP required
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-600" /> Non-commercial & independent
              </span>
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-amber-600" /> No investment recommendations
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* Product Preview — Golden Result Structure Foreshadowing */}
      <section className="bg-[var(--surface-muted)] py-12 border-y border-[var(--border)]">
        <Container size="default">
          <div className="flex flex-col gap-6 max-w-4xl mx-auto">
            <div className="flex flex-col gap-2 text-center">
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--brand-primary)]">
                Structured Safety Result Preview
              </h2>
              <p className="text-sm text-[var(--text-muted)]">
                Our system breaks down suspicious financial content into 5 transparent, explainable layers:
              </p>
            </div>

            {/* Simulated Result Card Preview */}
            <Card variant="elevated" className="bg-[var(--surface)] border-l-4 border-l-[var(--brand-primary)]">
              <div className="flex flex-col gap-6">
                {/* Header Stage */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold">
                      Sample Analysis Case
                    </span>
                    <h3 className="text-base font-bold text-[var(--text-primary)]">
                      WhatsApp Message: &quot;Join VIP SEBI Channel — Guaranteed 300% Monthly Profit&quot;
                    </h3>
                  </div>
                  <SeverityBadge severity="HIGH" />
                </div>

                {/* 5-Stage Result Matrix */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {/* Stage 1 */}
                  <div className="p-3.5 rounded bg-slate-50 border border-slate-200 flex flex-col gap-1">
                    <div className="flex items-center gap-2 font-semibold text-slate-800">
                      <FileText className="w-4 h-4 text-slate-600" />
                      <span>1. What the Message Claims</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Offers guaranteed stock advisory returns and claims SEBI registration via VIP Telegram group.
                    </p>
                  </div>

                  {/* Stage 2 */}
                  <div className="p-3.5 rounded bg-amber-50 border border-amber-200 flex flex-col gap-1">
                    <div className="flex items-center gap-2 font-semibold text-amber-900">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>2. What We Detected</span>
                    </div>
                    <p className="text-xs text-amber-800 leading-relaxed">
                      Detected 3 high-risk signals: Guaranteed returns promise, urgency pressure, and unverified broker links.
                    </p>
                  </div>

                  {/* Stage 3 */}
                  <div className="p-3.5 rounded bg-emerald-50 border border-emerald-200 flex flex-col gap-1">
                    <div className="flex items-center gap-2 font-semibold text-emerald-900">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>3. What We Verified</span>
                    </div>
                    <p className="text-xs text-emerald-800 leading-relaxed">
                      Entity name &quot;VIP Trade Corp&quot; does NOT match SEBI registered research analyst registry.
                    </p>
                  </div>

                  {/* Stage 4 */}
                  <div className="p-3.5 rounded bg-sky-50 border border-sky-200 flex flex-col gap-1">
                    <div className="flex items-center gap-2 font-semibold text-sky-900">
                      <HelpCircle className="w-4 h-4 text-sky-600" />
                      <span>4. What We Couldn&apos;t Verify</span>
                    </div>
                    <p className="text-xs text-sky-800 leading-relaxed">
                      Group administrator identity is masked behind international VoIP numbers.
                    </p>
                  </div>
                </div>

                {/* Stage 5: Safe Action */}
                <div className="p-4 rounded bg-[var(--brand-light)] border border-slate-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--brand-primary)]">
                      5. Recommended Safe Next Step
                    </span>
                    <span className="text-xs text-[var(--text-secondary)]">
                      Do not send money or join payment links. Verify official SEBI Research Analysts on SCORES.
                    </span>
                  </div>
                  <Button variant="outline" size="sm" className="bg-white shrink-0">
                    Learn How to Verify
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </Container>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works">
        <Container size="default">
          <div className="flex flex-col gap-10 max-w-4xl mx-auto">
            <div className="flex flex-col gap-2 text-center">
              <h2 className="text-2xl font-bold text-[var(--brand-primary)]">
                Designed for First-Time Digital Investors
              </h2>
              <p className="text-sm text-[var(--text-muted)]">
                A simple outer experience backed by transparent risk analysis and public evidence registries.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card variant="bordered" className="flex flex-col gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--brand-light)] text-[var(--brand-primary)] flex items-center justify-center font-bold">
                  1
                </div>
                <h3 className="font-bold text-base text-[var(--text-primary)]">Paste or Upload</h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Drop a screenshot or paste the exact text from WhatsApp, Telegram, YouTube comments, or Instagram ads.
                </p>
              </Card>

              <Card variant="bordered" className="flex flex-col gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--brand-light)] text-[var(--brand-primary)] flex items-center justify-center font-bold">
                  2
                </div>
                <h3 className="font-bold text-base text-[var(--text-primary)]">Instant Pattern Match</h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Our rule engine extracts claims, identifies high-risk urgency indicators, and checks entity registration statuses.
                </p>
              </Card>

              <Card variant="bordered" className="flex flex-col gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--brand-light)] text-[var(--brand-primary)] flex items-center justify-center font-bold">
                  3
                </div>
                <h3 className="font-bold text-base text-[var(--text-primary)]">Act Safely</h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Get clear, actionable guidance on how to report suspicious groups or verify registered intermediaries officially.
                </p>
              </Card>
            </div>
          </div>
        </Container>
      </section>

      {/* Safety Principles Section */}
      <section id="safety-principles" className="border-t border-[var(--border)] pt-12">
        <Container size="default">
          <div className="bg-[var(--surface-muted)] p-6 sm:p-8 rounded-xl border border-[var(--border)] max-w-4xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-bold text-[var(--brand-primary)]">
                Independent Public Safety Tool
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed max-w-xl">
                {SITE_CONFIG.disclaimer} We do not evaluate stock valuations, predict market movements, or endorse commercial advisory channels.
              </p>
            </div>
            <Link href="/check" className="shrink-0 w-full sm:w-auto">
              <Button variant="primary" size="md" className="w-full sm:w-auto">
                Check Content Now
              </Button>
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
