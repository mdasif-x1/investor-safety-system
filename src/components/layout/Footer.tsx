import React from "react";
import Link from "next/link";
import { ShieldCheck, ExternalLink, Info } from "lucide-react";
import { SITE_CONFIG } from "@/config/site";
import { Container } from "@/components/ui/Container";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[var(--brand-primary)] text-white border-t border-slate-800 pt-12 pb-8">
      <Container size="wide">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-slate-700/80">
          {/* Column 1: System Purpose */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span className="font-bold text-lg tracking-tight text-white">
                {SITE_CONFIG.name}
              </span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              {SITE_CONFIG.description}
            </p>
            <p className="text-xs text-slate-400 pt-2 font-medium">
              Developed for {SITE_CONFIG.institution}
            </p>
          </div>

          {/* Column 2: Public Portals & Verification */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
              Verified Public Safety Portals
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm">
              {SITE_CONFIG.footerLinks.map((link) => (
                <li key={link.name}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
                    >
                      <span>{link.name}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-slate-300 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Institutional Safety Disclaimer */}
          <div className="flex flex-col gap-3 bg-slate-800/60 p-4 rounded-lg border border-slate-700/60">
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              <Info className="w-4 h-4 shrink-0" />
              <span>Public Safety Notice</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {SITE_CONFIG.disclaimer}
            </p>
            <div className="text-[11px] text-slate-400 pt-2">
              Risk Signal Detection is not a definitive Scam Verdict. Unverified does not mean proven false. Always double-check official SEBI registers before transferring money.
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} {SITE_CONFIG.fullName}. Public Interest Project.
          </div>
          <div className="flex items-center gap-4">
            <span>Track A — Digital Fraud Resilience</span>
            <span>•</span>
            <span>Track E — Financial Literacy</span>
          </div>
        </div>
      </Container>
    </footer>
  );
};
