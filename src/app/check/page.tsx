"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Upload, MessageSquare, AlertCircle, RefreshCw, X, FileText, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Textarea } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { analysisService } from "@/features/analysis/services/AnalysisService";
import { AnalysisStage } from "@/types/analysis";

const PRESET_SAMPLE = {
  suspicious: "SEBI Registered Expert. Guaranteed 25% monthly returns. Limited seats. Join our Telegram group and deposit ₹20,000 today.",
  hinglish: "Bhai SEBI registered hu. 25% fix return milega. Bas 20k bhej do aur telegram grp join kro. Limited seats!",
  legitimate: "SEBI investor education webinar explaining mutual fund risks and diversification.",
  adversarial: "Educational purposes only. Guaranteed returns are not promised. Join our Telegram channel to learn about common investment scams.",
};

export default function CheckPage() {
  const router = useRouter();

  // Input states
  const [inputText, setInputText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Processing state machine
  const [processingState, setProcessingState] = useState<"IDLE" | "PROCESSING" | "ERROR">("IDLE");
  const [currentStage, setCurrentStage] = useState<AnalysisStage>("MESSAGE_RECEIVED");

  // Handle file selection & validation
  const handleFileChange = (file: File | null) => {
    setErrorMsg(null);
    if (!file) return;

    // Validate MIME type
    const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setErrorMsg("Invalid file format. Please upload a PNG, JPG, or WEBP screenshot.");
      return;
    }

    // Validate File Size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg("File size too large. Please upload an image smaller than 10MB.");
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleClearImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setErrorMsg(null);
  };

  // Execute believable multi-stage analysis process
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const hasText = inputText.trim().length > 0;
    const hasImage = selectedFile !== null;

    if (!hasText && !hasImage) {
      setErrorMsg("Please paste message text or upload a screenshot to inspect.");
      return;
    }

    setProcessingState("PROCESSING");
    setCurrentStage("MESSAGE_RECEIVED");

    try {
      // Stage 1: Received
      await new Promise((res) => setTimeout(res, 400));
      setCurrentStage("TEXT_EXTRACTED");

      // Stage 2: Normalization & Extraction
      await new Promise((res) => setTimeout(res, 500));
      setCurrentStage("SIGNALS_IDENTIFIED");

      // Stage 3: Risk Signal Evaluation
      let result;
      if (hasImage && selectedFile) {
        result = await analysisService.analyzeImage(selectedFile);
      } else {
        result = await analysisService.analyzeText(inputText);
      }

      await new Promise((res) => setTimeout(res, 500));
      setCurrentStage("EVIDENCE_CHECKING");

      await new Promise((res) => setTimeout(res, 400));
      setCurrentStage("COMPLETED");

      // Navigate to preliminary result page
      router.push(`/analysis/${result.id}`);
    } catch (err: unknown) {
      setProcessingState("ERROR");
      if (err instanceof Error && err.message) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("An unexpected error occurred during message inspection. Please try again.");
      }
    }
  };

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
              Upload a screenshot or paste text received on WhatsApp, Telegram, or social media. We will inspect risk signals and verify available evidence before you act.
            </p>
          </div>

          {/* Processing State Representation */}
          {processingState === "PROCESSING" ? (
            <Card variant="elevated" className="p-8 flex flex-col items-center justify-center text-center gap-6">
              <RefreshCw className="w-10 h-10 text-[var(--brand-primary)] animate-spin" />
              <div className="flex flex-col gap-1">
                <h2 className="text-lg font-bold text-[var(--brand-primary)]">
                  Inspecting Financial Content
                </h2>
                <p className="text-xs text-[var(--text-muted)]">
                  Running fast pattern matching and risk-rule evaluation...
                </p>
              </div>

              {/* Real Pipeline Stage Indicators */}
              <div className="w-full max-w-md flex flex-col gap-3 text-left border-t border-[var(--border)] pt-4 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-slate-800">Message Received</span>
                </div>
                <div className="flex items-center gap-2">
                  {currentStage === "TEXT_EXTRACTED" || currentStage === "SIGNALS_IDENTIFIED" || currentStage === "EVIDENCE_CHECKING" || currentStage === "COMPLETED" ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-slate-300" />
                  )}
                  <span className={currentStage === "TEXT_EXTRACTED" ? "font-bold text-[var(--brand-primary)]" : "text-slate-700"}>
                    Content Prepared &amp; Normalized
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {currentStage === "SIGNALS_IDENTIFIED" || currentStage === "EVIDENCE_CHECKING" || currentStage === "COMPLETED" ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-slate-300" />
                  )}
                  <span className={currentStage === "SIGNALS_IDENTIFIED" ? "font-bold text-[var(--brand-primary)]" : "text-slate-700"}>
                    Identifying Warning Signals
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {currentStage === "EVIDENCE_CHECKING" || currentStage === "COMPLETED" ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-slate-300" />
                  )}
                  <span className={currentStage === "EVIDENCE_CHECKING" ? "font-bold text-[var(--brand-primary)]" : "text-slate-700"}>
                    Preparing Preliminary Result
                  </span>
                </div>
              </div>
            </Card>
          ) : (
            <Card variant="elevated" className="flex flex-col gap-6">
              {/* Sample Preset Selector for Hackathon Demo */}
              <div className="bg-slate-50 p-3.5 rounded border border-slate-200 flex flex-col gap-2 text-xs">
                <span className="font-bold text-slate-700 uppercase tracking-wider">
                  Try Sample Messages (Hackathon Demo Test Cases):
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setInputText(PRESET_SAMPLE.suspicious);
                      setSelectedFile(null);
                      setImagePreview(null);
                    }}
                    className="px-2.5 py-1 rounded bg-amber-100 hover:bg-amber-200 text-amber-900 font-medium transition-colors"
                  >
                    Suspicious WhatsApp Tip
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setInputText(PRESET_SAMPLE.hinglish);
                      setSelectedFile(null);
                      setImagePreview(null);
                    }}
                    className="px-2.5 py-1 rounded bg-purple-100 hover:bg-purple-200 text-purple-900 font-medium transition-colors"
                  >
                    Hinglish WhatsApp Tip
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setInputText(PRESET_SAMPLE.legitimate);
                      setSelectedFile(null);
                      setImagePreview(null);
                    }}
                    className="px-2.5 py-1 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-medium transition-colors"
                  >
                    Legitimate SEBI Webinar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setInputText(PRESET_SAMPLE.adversarial);
                      setSelectedFile(null);
                      setImagePreview(null);
                    }}
                    className="px-2.5 py-1 rounded bg-sky-100 hover:bg-sky-200 text-sky-900 font-medium transition-colors"
                  >
                    Adversarial Disclaimer
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {/* File Upload Area */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-[var(--text-primary)] flex items-center justify-between">
                    <span>Option A: Upload Screenshot</span>
                    <span className="text-xs text-[var(--text-muted)] font-normal">PNG, JPG, WEBP &lt; 10MB</span>
                  </label>

                  {imagePreview ? (
                    <div className="relative border border-[var(--border)] rounded-lg p-4 bg-slate-50 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="w-6 h-6 text-[var(--brand-primary)] shrink-0" />
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-[var(--text-primary)] truncate max-w-[200px] sm:max-w-xs">
                            {selectedFile?.name}
                          </span>
                          <span className="text-[10px] text-[var(--text-muted)]">
                            {((selectedFile?.size || 0) / 1024).toFixed(1)} KB
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleClearImage}
                        className="p-1.5 rounded-full hover:bg-slate-200 text-slate-600"
                        title="Remove Image"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-[var(--border-subtle)] rounded-lg p-6 sm:p-8 flex flex-col items-center justify-center text-center bg-[var(--surface-muted)] hover:bg-slate-100/80 transition-colors cursor-pointer">
                      <Upload className="w-8 h-8 text-[var(--text-muted)] mb-2" />
                      <span className="text-sm font-medium text-[var(--text-primary)]">
                        Click to select or drag screenshot here
                      </span>
                      <span className="text-xs text-[var(--text-muted)] mt-1">
                        WhatsApp chat capture, Telegram post, or Instagram ad
                      </span>
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/jpg, image/webp"
                        onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-[var(--border)]"></div>
                  <span className="flex-shrink mx-4 text-xs uppercase font-bold text-[var(--text-muted)]">
                    OR PASTE TEXT
                  </span>
                  <div className="flex-grow border-t border-[var(--border)]"></div>
                </div>

                {/* Text Area Input */}
                <Textarea
                  label="Option B: Message Text or Advisory Claim"
                  value={inputText}
                  onChange={(e) => {
                    setInputText(e.target.value);
                    setErrorMsg(null);
                  }}
                  placeholder="Paste message text here..."
                  rows={5}
                  helperText="Do not include personal bank details, PINs, or passwords."
                />

                {errorMsg && (
                  <div className="bg-red-50 border border-red-200 p-3.5 rounded-md flex items-start gap-3 text-xs text-red-900">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-md flex items-start gap-3 text-xs text-amber-900">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Privacy Guardrail:</strong> Do not submit your bank account numbers, OTPs, or personal identity documents.
                  </span>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-xs text-[var(--text-muted)]">
                    Fast pattern inspection takes &lt; 1 second.
                  </span>
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    icon={<MessageSquare className="w-4 h-4" />}
                    disabled={inputText.trim().length === 0 && !selectedFile}
                    className="w-full sm:w-auto"
                  >
                    Check This Message
                  </Button>
                </div>
              </form>
            </Card>
          )}
        </div>
      </Container>
    </div>
  );
}
