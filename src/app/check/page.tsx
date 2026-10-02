import React from "react";
import Link from "next/link";
import { ArrowLeft, Upload, MessageSquare, AlertCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Textarea } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";

export default function CheckPage() {
  return (
    <div className="py-10">
      <Container size="narrow">
        <div className="flex flex-col gap-8">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--brand-primary)] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Overview</span>
            </Link>
          </div>

          <div className="flex flex-col gap-2">
            <Badge variant="brand" className="w-fit">
              Step 1 of 3 — Content Submission
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--brand-primary)]">
              Check a Suspicious Financial Message
            </h1>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Paste message text, claims, or upload a screenshot from WhatsApp, Telegram, or social media. We will inspect risk signals and verify available public evidence.
            </p>
          </div>

          <Card variant="elevated" className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[var(--text-primary)] flex items-center justify-between">
                <span>Option A: Upload Screenshot</span>
                <span className="text-xs text-[var(--text-muted)] font-normal">PNG, JPG up to 10MB</span>
              </label>
              <div className="border-2 border-dashed border-[var(--border-subtle)] rounded-lg p-6 sm:p-8 flex flex-col items-center justify-center text-center bg-[var(--surface-muted)] hover:bg-slate-100/80 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-[var(--text-muted)] mb-2" />
                <span className="text-sm font-medium text-[var(--text-primary)]">
                  Click or drag screenshot here
                </span>
                <span className="text-xs text-[var(--text-muted)] mt-1">
                  WhatsApp chat export, Telegram channel capture, or Instagram post image
                </span>
              </div>
            </div>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-[var(--border)]"></div>
              <span className="flex-shrink mx-4 text-xs uppercase font-bold text-[var(--text-muted)]">
                OR PASTE TEXT
              </span>
              <div className="flex-grow border-t border-[var(--border)]"></div>
            </div>

            <div className="flex flex-col gap-2">
              <Textarea
                label="Option B: Message Text or Advisory Claim"
                placeholder="Paste suspicious advisory text here..."
                rows={5}
                helperText="Paste the full message text. Do not share personal bank details, PINs, or passwords."
              />
            </div>

            <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-md flex items-start gap-3 text-xs text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Privacy Guardrail:</strong> Never paste your bank account numbers, OTPs, UPI PINs, or personal identity documents.
              </span>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-[var(--text-muted)]">
                Preliminary risk analysis takes &lt; 1 second.
              </span>
              <Link href="/result" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" icon={<MessageSquare className="w-4 h-4" />} className="w-full sm:w-auto">
                  Inspect &amp; Verify Message
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </Container>
    </div>
  );
}
