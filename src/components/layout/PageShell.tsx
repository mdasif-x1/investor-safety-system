import React from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

interface PageShellProps {
  children: React.ReactNode;
}

export const PageShell: React.FC<PageShellProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] antialiased">
      <Header />
      <main className="flex-1 w-full">{children}</main>
      <Footer />
    </div>
  );
};
