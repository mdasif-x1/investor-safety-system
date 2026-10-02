import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="py-20">
      <Container size="narrow">
        <div className="flex flex-col items-center text-center gap-6">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-[var(--brand-primary)]">
            <ShieldAlert className="w-8 h-8 text-[var(--accent-saffron)]" />
          </div>
          <h1 className="text-3xl font-bold text-[var(--brand-primary)]">Page Not Found</h1>
          <p className="text-sm text-[var(--text-secondary)] max-w-md">
            The requested safety analysis page or resource does not exist or has been moved.
          </p>
          <Link href="/">
            <Button variant="primary" size="md" icon={<ArrowLeft className="w-4 h-4" />}>
              Return to Home Overview
            </Button>
          </Link>
        </div>
      </Container>
    </div>
  );
}
