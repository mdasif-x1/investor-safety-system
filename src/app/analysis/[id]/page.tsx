"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  AlertTriangle,
  ShieldCheck,
  HelpCircle,
  AlertCircle,
  FileText,
  ArrowRight,
  Info,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Lock,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge, SeverityBadge, EvidenceBadge } from "@/components/ui/Badge";
import { analysisService } from "@/features/analysis/services/AnalysisService";

export default function EvidenceAwareResultPage() {
  const params = useParams();
  const id = params.id as string;
  const analysis = analysisService.getAnalysisById(id);

  const [showAlreadyPaid, setShowAlreadyPaid] = useState(false);

  if (!analysis) {
    return (
      <div className="py-16">
        <Container size="narrow">
          <Card variant="bordered" className="flex flex-col items-center text-center gap-4 p-8">
            <AlertCircle className="w-10 h-10 text-amber-600" />
            <h1 className="text-xl font-bold text-[var(--brand-primary)]">
              Analysis Record Not Found
            </h1>
            <p className="text-xs text-[var(--text-secondary)] max-w-md">
              This analysis report is no longer stored in memory for this prototype session. You can start a new message check.
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

  const hasCriticalRisk = analysis.riskSignals.some((s) => s.severity === "CRITICAL" || s.severity === "HIGH");

  const doNowActions = analysis.recommendedSafeActions.filter((a) => a.priority === "DO_NOW");
  const verifyActions = analysis.recommendedSafeActions.filter((a) => a.priority === "VERIFY_BEFORE_ACTING");
  const paidActions = analysis.recommendedSafeActions.filter((a) => a.priority === "IF_ALREADY_PAID");

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
              <span>Check Another Message</span>
            </Link>
          </div>

          <Card variant="elevated" className="border-l-4 border-l-[var(--brand-primary)] bg-[var(--surface)]">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="brand">Investor Safety Report</Badge>
                    <span className="text-xs text-[var(--text-muted)] font-mono">ID: {analysis.id}</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--brand-primary)]">
                    {hasCriticalRisk ? "Several Warning Signs Detected" : "No Major Scam Signals Detected"}
                  </h1>
                </div>
                {analysis.riskSignals.length > 0 && (
                  <SeverityBadge severity={hasCriticalRisk ? "CRITICAL" : "MEDIUM"} />
                )}
              </div>

              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {analysis.uncertaintyExplanation}
              </p>

              <div className="p-3 bg-slate-100 rounded border border-slate-200 text-xs flex flex-col gap-1">
                <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                  Submitted Content:
                </span>
                <p className="text-slate-800 italic leading-relaxed">&quot;{analysis.normalizedText}&quot;</p>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 flex flex-col gap-6">
              <Card variant="bordered" className="flex flex-col gap-4">
                <div className="flex flex-col gap-1 border-b border-[var(--border)] pb-3">
                  <h2 className="text-base sm:text-lg font-bold text-[var(--brand-primary)] flex items-center gap-2">
                    <FileText className="w-5 h-5 text-slate-700" />
                    <span>1. What the Message Claims</span>
                  </h2>
                  <p className="text-xs text-[var(--text-muted)]">
                    Explicit statements extracted directly from the submitted text.
                  </p>
                </div>

                {analysis.claims.length === 0 ? (
                  <p className="text-xs text-[var(--text-muted)] italic">No explicit advisory claims extracted.</p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {analysis.claims.map((claim) => (
                      <div key={claim.id} className="p-4 rounded bg-slate-50 border border-slate-200 flex flex-col gap-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <span className="font-bold text-sm text-slate-900">{claim.statement}</span>
                          <EvidenceBadge status={claim.evidenceStatus} />
                        </div>
                        {claim.sourceSnippet && (
                          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-white px-2.5 py-1 rounded border border-slate-200 w-fit">
                            <span className="font-semibold text-slate-500">Source Text:</span>
                            <code className="font-mono text-slate-800">&quot;{claim.sourceSnippet}&quot;</code>
                          </div>
                        )}
                        <p className="text-xs text-slate-700">{claim.explanation}</p>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              <Card variant="bordered" className="flex flex-col gap-4">
                <div className="flex flex-col gap-1 border-b border-[var(--border)] pb-3">
                  <h2 className="text-base sm:text-lg font-bold text-[var(--brand-primary)] flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                    <span>2. What We Detected (Risk Signals)</span>
                  </h2>
                  <p className="text-xs text-[var(--text-muted)]">
                    Characteristics matched against SEBI regulatory guidelines and advisory fraud patterns.
                  </p>
                </div>

                {analysis.riskSignals.length === 0 ? (
                  <div className="p-4 rounded border border-emerald-200 bg-emerald-50 text-xs text-emerald-900 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>No high-risk language patterns were identified in this message.</span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {analysis.riskSignals.map((signal) => (
                      <div
                        key={signal.id}
                        className={`p-4 rounded border flex flex-col gap-2 ${
                          signal.severity === "CRITICAL"
                            ? "border-red-200 bg-red-50/70"
                            : signal.severity === "HIGH"
                            ? "border-amber-200 bg-amber-50/70"
                            : "border-sky-200 bg-sky-50/70"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-slate-900">{signal.title}</span>
                          <SeverityBadge severity={signal.severity} />
                        </div>
                        <p className="text-xs text-slate-800 leading-relaxed">{signal.description}</p>
                        {signal.matchedTextSnippet && (
                          <div className="flex items-center gap-1.5 text-xs text-slate-700 bg-white/90 px-2.5 py-1 rounded border border-slate-200 w-fit">
                            <span className="font-semibold text-slate-500">Matched Phrase:</span>
                            <code className="font-mono text-slate-900">&quot;{signal.matchedTextSnippet}&quot;</code>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              <Card variant="bordered" className="flex flex-col gap-4">
                <div className="flex flex-col gap-1 border-b border-[var(--border)] pb-3">
                  <h2 className="text-base sm:text-lg font-bold text-[var(--brand-primary)] flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <span>3. What We Can Verify (Evidence Registry)</span>
                  </h2>
                </div>

                <div className="flex flex-col gap-3">
                  {analysis.verifiedEvidence.map((ev) => (
                    <div key={ev.id} className="p-4 bg-slate-50 border border-slate-200 rounded flex flex-col gap-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <span className="font-bold text-sm text-slate-900">{ev.sourceName}</span>
                        <EvidenceBadge status={ev.status} />
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">{ev.explanation}</p>
                      {ev.sourceUrl && (
                        <a
                          href={ev.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-700 hover:underline pt-1"
                        >
                          <span>Official Reference Link</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </Card>

              <Card variant="bordered" className="flex flex-col gap-4 bg-slate-50/80">
                <div className="flex flex-col gap-1 border-b border-[var(--border)] pb-3">
                  <h2 className="text-base sm:text-lg font-bold text-[var(--brand-primary)] flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-sky-600" />
                    <span>4. What Remains Unknown / Uncertain</span>
                  </h2>
                  <p className="text-xs text-[var(--text-muted)]">
                    Crucial details that could not be independently proven from the submitted text alone.
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  {analysis.uncertaintyItems.map((unc) => (
                    <div key={unc.id} className="p-3.5 bg-white border border-slate-200 rounded flex flex-col gap-1 text-xs">
                      <strong className="text-slate-900 font-bold">{unc.title}</strong>
                      <span className="text-slate-700">{unc.explanation}</span>
                      <span className="text-[11px] text-slate-500 italic mt-0.5">Reason: {unc.reason}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div className="flex flex-col gap-6">
              <Card variant="bordered" className="flex flex-col gap-5 bg-[var(--brand-light)] border-slate-300">
                <div className="flex flex-col gap-1 border-b border-slate-300 pb-3">
                  <h2 className="text-base font-bold text-[var(--brand-primary)] flex items-center gap-2">
                    <Lock className="w-4 h-4 text-emerald-700" />
                    <span>5. Recommended Safe Next Steps</span>
                  </h2>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Actions prioritized by urgency before money moves.
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-red-800 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-red-600" /> DO NOW (Immediate Safety)
                  </span>
                  <ul className="flex flex-col gap-2.5 text-xs">
                    {doNowActions.map((act) => (
                      <li key={act.id} className="p-3 bg-white rounded border border-red-200 flex flex-col gap-1 shadow-subtle">
                        <strong className="text-red-900 font-bold">{act.title}</strong>
                        <span className="text-slate-700 leading-relaxed">{act.description}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col gap-2 pt-2 border-t border-slate-200">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-sky-900 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-sky-600" /> VERIFY BEFORE ACTING
                  </span>
                  <ul className="flex flex-col gap-2.5 text-xs">
                    {verifyActions.map((act) => (
                      <li key={act.id} className="p-3 bg-white rounded border border-slate-200 flex flex-col gap-1 shadow-subtle">
                        <strong className="text-[var(--brand-primary)] font-bold">{act.title}</strong>
                        <span className="text-slate-700 leading-relaxed">{act.description}</span>
                        {act.externalLink && (
                          <a
                            href={act.externalLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-700 hover:underline pt-1"
                          >
                            <span>Official Search Portal</span>
                            <ArrowRight className="w-3 h-3" />
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-3 border-t border-slate-300 flex flex-col gap-2">
                  <button
                    onClick={() => setShowAlreadyPaid(!showAlreadyPaid)}
                    className="flex items-center justify-between text-xs font-bold text-slate-800 hover:text-[var(--brand-primary)] transition-colors w-full text-left p-2 rounded bg-slate-200/60"
                  >
                    <span>Already Transferred Money?</span>
                    {showAlreadyPaid ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {showAlreadyPaid && (
                    <div className="flex flex-col gap-2 pt-1 text-xs">
                      {paidActions.map((act) => (
                        <div key={act.id} className="p-3 bg-amber-50 rounded border border-amber-300 flex flex-col gap-1">
                          <strong className="text-amber-900 font-bold">{act.title}</strong>
                          <span className="text-amber-950 leading-relaxed">{act.description}</span>
                          {act.externalLink && (
                            <a
                              href={act.externalLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-900 hover:underline pt-1"
                            >
                              <span>Official Cybercrime Portal</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>

              <Card variant="flat" className="p-4 bg-slate-100 border border-slate-200 flex flex-col gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                  <Info className="w-4 h-4 text-slate-600" />
                  <span>Why This Analysis Matters</span>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  A message can use legitimate logo names or mention SEBI regulations without proving that the sender is authorized. Always verify registration on official registers before sending money.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}