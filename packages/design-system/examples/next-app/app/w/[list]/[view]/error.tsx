"use client";

import { Alert, Button } from "@/components/agere-ds";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="p-6">
      <Alert variant="error" title="We couldn’t load this list" actions={<Button size="sm" variant="outline" onClick={reset}>Try again</Button>}>
        Check your connection. Your changes are saved.
      </Alert>
    </div>
  );
}
