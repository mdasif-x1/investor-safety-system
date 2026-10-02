import type { Metadata } from "next";
import "./globals.css";
import { SITE_CONFIG } from "@/config/site";
import { PageShell } from "@/components/layout/PageShell";

export const metadata: Metadata = {
  title: {
    default: `${SITE_CONFIG.name} — Investor Safety System`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: [
    "SEBI investor safety",
    "financial scam detection",
    "WhatsApp investment warning",
    "NSDL investor protection",
    "unregistered advisor check",
    "investor resilience hackathon",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <PageShell>{children}</PageShell>
      </body>
    </html>
  );
}
