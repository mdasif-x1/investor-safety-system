"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, AlertTriangle, ShieldCheck, HelpCircle, AlertCircle, FileText, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge, SeverityBadge, EvidenceBadge } from "@/components/ui/Badge";
import { analysisService } from "@/features/analysis/services/AnalysisService";

export default function PreliminaryResultPage() {
  const params = useParams();
  const id = params.id as string;
  const analysis = analysisService.getAnalysisById(id);

  if (!analysis) {
    return (
      <div className="py-16">
        <Container size="narrow">
          <Card variant="bordered" className="flex flex-col items-center text-center gap-4 p-8">
            <AlertCircle className="w-10 h-10 text-amber-600" />
            <h1 className="text-xl font-bold text-[var(--brand-primary)]">
              Analysis Session Not Found
            </h1>
            <p className="text-xs text-[var(--text-secondary)] max-w-md">
              This analysis record is no longer available in memory for this prototype session. You can start a new message check.
            </p>
            <Link href="/check">
              <Button variant="primary" size="md" icon={<ArrowLeft className="w-4 h-4" />}>
                Start a New Check
              </Button>
            </Link>
          </Card>
        </Container>
      </div>
    );
  }

  const hasHighRisk = analysis.riskSignals.some((s) => s.severity === "CRITICAL" || s.severity === "HIGH");

  return (
    <div className="py-10">
      <Container size="default">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-6">
            <div className="flex flex-col gap-1">
              <Link
                href="/check"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--brand-primary)] transition-colors mb-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Check Another Message</span>
              </Link>
              <div className="flex items-center gap-2">
                <Badge variant="brand">Preliminary Risk Report</Badge>
                <span className="text-xs text-[var(--text-muted)]">ID: {analysis.id}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--brand-primary)]">
                {hasHighRisk ? "Several Warning Signs Found" : "No Major Scam Signals Detected"}
              </h1>
            </div>
            {analysis.riskSignals.length > 0 && (
              <SeverityBadge severity={hasHighRisk ? "CRITICAL" : "MEDIUM"} />
            )}
          </div>

          <Card variant="flat" className="p-4 bg-slate-100 border border-slate-200">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                Submitted Message Text:
              </span>
              <p className="text-xs text-slate-800 italic leading-relaxed">
                &quot;{analysis.normalizedText}&quot;
              </p>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 flex flex-col gap-6">
              <Card variant="elevated" className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <h2 className="text-lg font-bold text-[var(--brand-primary)] flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                    <span>1. What We Detected (Risk Signals)</span>
                  </h2>
                  <p className="text-xs text-[var(--text-muted)]">
                    Rule-based pattern detection against known fraudulent financial advisory indicators.
                  </p>
                </div>

                {analysis.riskSignals.length === 0 ? (
                  <div className="p-4 rounded border border-emerald-200 bg-emerald-50 text-xs text-emerald-900 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>No high-risk language patterns (guaranteed returns, urgency, unverified links) were found in this text.</span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {analysis.riskSignals.map((signal) => (
                      <div
                        key={signal.id}
                        className={`p-4 rounded border flex flex-col gap-1.5 ${
                          signal.severity === "CRITICAL"
                            ? "border-red-200 bg-red-50/60"
                            : signal.severity === "HIGH"
                            ? "border-amber-200 bg-amber-50/60"
                            : "border-sky-200 bg-sky-50/60"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-slate-900">{signal.title}</span>
                          <SeverityBadge severity={signal.severity} />
                        </div>
                        <p className="text-xs text-slate-800 leading-relaxed">{signal.description}</p>
                        {signal.matchedTextSnippet && (
                          <span className="text-[11px] text-slate-600 font-mono bg-white/80 px-2 py-0.5 rounded border border-slate-200 w-fit">
                            Pattern snippet: &quot;{signal.matchedTextSnippet}&quot;
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              <Card variant="bordered" className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <h2 className="text-base font-bold text-[var(--brand-primary)] flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-600" />
                    <span>2. What the Message Claims</span>
                  </h2>
                  <p className="text-xs text-[var(--text-muted)]">
                    Extracted explicit statements made by the sender.
                  </p>
                </div>

                {analysis.claims.length === 0 ? (
                  <p className="text-xs text-[var(--text-muted)] italic">No explicit high-risk claims extracted.</p>
                ) : (
                  <ul className="flex flex-col gap-2.5 text-xs">
                    {analysis.claims.map((claim) => (
                      <li key={claim.id} className="p-3 rounded bg-slate-50 border border-slate-200 flex flex-col gap-1">
                        <strong className="text-slate-900">{claim.statement}</strong>
                        <span className="text-slate-600">{claim.explanation}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>

              <Card variant="bordered" className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <h2 className="text-base font-bold text-[var(--brand-primary)] flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>3. Evidence Registry Status</span>
                  </h2>
                </div>

                <div className="flex flex-col gap-2">
                  {analysis.verifiedEvidence.map((ev) => (
                    <div key={ev.id} className="p-3 bg-slate-50 border border-slate-200 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">{ev.sourceName}</span>
                        <span className="text-slate-600">{ev.details}</span>
                      </div>
                      <EvidenceBadge status={ev.status} />
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div className="flex flex-col gap-6">
              <Card variant="bordered" className="flex flex-col gap-4 bg-[var(--brand-light)] border-slate-300">
                <div className="flex flex-col gap-1">
                  <h2 className="text-base font-bold text-[var(--brand-primary)] flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-sky-600" />
                    <span>4. What You Can Safely Do</span>
                  </h2>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Recommended safety measures before transferring funds.
                  </p>
                </div>

                <ul className="flex flex-col gap-3 text-xs">
                  {analysis.recommendedSafeActions.map((action) => (
                    <li key={action.id} className="p-3 bg-white rounded border border-slate-200 flex flex-col gap-1.5 shadow-subtle">
                      <strong className="text-[var(--brand-primary)]">{action.title}</strong>
                      <span className="text-slate-700 leading-relaxed">{action.description}</span>
                      {action.externalLink && (
                        <a
                          href={action.externalLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-700 hover:underline pt-1"
                        >
                          <span>Open Official SEBI SCORES</span>
                          <ArrowRight className="w-3 h-3" />
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </Card>

              <div className="p-4 rounded border border-slate-200 bg-slate-50 text-[11px] text-slate-600 leading-relaxed">
                <strong>Public Interest Notice:</strong> Risk signals are detected using pattern rules. This system provides safety verification guidance — not investment advice.
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}