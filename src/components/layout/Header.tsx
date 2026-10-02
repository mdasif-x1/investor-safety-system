"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShieldCheck, ArrowRight, Menu, X } from "lucide-react";
import { SITE_CONFIG } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-[var(--surface)] border-b border-[var(--border)] shadow-subtle">
      <div className="bg-[var(--brand-primary)] text-white text-xs py-1.5 px-4 text-center font-medium tracking-wide">
        <span className="opacity-90">SANGYAN Hackathon Prototype</span> — {SITE_CONFIG.institution}
      </div>

      <Container size="wide">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded bg-[var(--brand-primary)] text-white flex items-center justify-center font-bold text-lg shadow-sm group-hover:bg-[var(--brand-hover)] transition-colors">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight text-[var(--brand-primary)] leading-tight">
                {SITE_CONFIG.name}
              </span>
              <span className="text-[10px] text-[var(--text-muted)] font-medium">
                Public Investor Resilience System
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {SITE_CONFIG.nav.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--brand-primary)] transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/check">
              <Button variant="primary" size="sm" icon={<ArrowRight className="w-4 h-4" />}>
                Check a Message
              </Button>
            </Link>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-[var(--text-secondary)] hover:bg-[var(--surface-muted)]"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </Container>

      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[var(--border)] bg-[var(--surface)] px-4 pt-3 pb-5 flex flex-col gap-3">
          {SITE_CONFIG.nav.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium py-2 text-[var(--text-primary)] hover:text-[var(--brand-primary)]"
            >
              {item.name}
            </Link>
          ))}
          <div className="pt-2 border-t border-[var(--border)]">
            <Link href="/check" onClick={() => setMobileMenuOpen(false)} className="w-full">
              <Button variant="primary" size="md" className="w-full justify-center">
                Check a Message Now
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
