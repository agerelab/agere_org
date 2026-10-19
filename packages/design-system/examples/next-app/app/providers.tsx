"use client";

import { Toaster, TooltipProvider } from "@/components/agere-ds";

/** Client-only context lives here so every page can stay a Server Component. */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider delayDuration={300}>
      {children}
      <Toaster />
    </TooltipProvider>
  );
}
