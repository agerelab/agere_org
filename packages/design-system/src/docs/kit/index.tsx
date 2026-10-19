import * as React from "react";
import { Check, Copy, X as XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

/* ================================================================== */
/* Hash router — single-file friendly                                  */
/* ================================================================== */
export function useRoute(): string {
  const get = () => (typeof window === "undefined" ? "/" : window.location.hash.replace(/^#/, "") || "/");
  const [route, setRoute] = React.useState(get);
  React.useEffect(() => {
    const on = () => {
      setRoute(get());
      document.getElementById("main-content")?.scrollTo?.(0, 0);
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return route;
}
export const href = (path: string) => `#${path}`;

/* ================================================================== */
/* Page chrome                                                         */
/* ================================================================== */
export function PageHeader({ eyebrow, title, description, badges, actions }: { eyebrow?: string; title: string; description?: React.ReactNode; badges?: React.ReactNode; actions?: React.ReactNode }) {
  React.useEffect(() => { document.title = `${title} · agere DS`; }, [title]);
  return (
    <header className="grid gap-3 border-b border-subtle pb-8">
      {eyebrow && <p className="text-xs font-medium text-muted-foreground text-subtle">{eyebrow}</p>}
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="type-display-md text-emphasis">{title}</h1>
        {badges}
      </div>
      {description && <p className="max-w-prose text-base leading-7 text-default">{description}</p>}
      {actions && <div className="mt-1 flex flex-wrap gap-2">{actions}</div>}
    </header>
  );
}

export function Section({ id, title, description, children, className }: { id?: string; title: string; description?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} aria-labelledby={id ? `${id}-h` : undefined} className={cn("grid scroll-mt-20 gap-4 pt-10", className)}>
      <div className="grid gap-1">
        <h2 id={id ? `${id}-h` : undefined} className="type-heading-lg text-emphasis">{title}</h2>
        {description && <p className="max-w-prose text-sm leading-6 text-subtle">{description}</p>}
      </div>
      {children}
    </section>
  );
}

export function Prose({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "max-w-prose text-sm leading-6 text-default",
        "[&_h3]:mt-6 [&_h3]:type-heading-sm [&_h3]:text-emphasis [&_p]:mt-2 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mt-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mt-1",
        "[&_code]:rounded-sm [&_code]:bg-subtle [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em] [&_code]:text-emphasis [&_strong]:font-semibold [&_strong]:text-emphasis",
        "[&_a]:font-medium [&_a]:text-emphasis [&_a]:underline [&_a]:underline-offset-2",
        className
      )}
    >
      {children}
    </div>
  );
}

/* ================================================================== */
/* Live preview                                                        */
/* ================================================================== */
export function Preview({ children, className, label, padded = true, align = "center" }: { children: React.ReactNode; className?: string; label?: string; padded?: boolean; align?: "center" | "start" | "stretch" }) {
  return (
    <figure className="overflow-hidden rounded-xl border border-subtle">
      <div
        className={cn(
          "flex min-h-[160px] flex-wrap gap-3 bg-muted bg-[radial-gradient(hsl(var(--ag-border-subtle))_1px,transparent_1px)] [background-size:16px_16px]",
          padded && "p-6 sm:p-10",
          align === "center" && "items-center justify-center",
          align === "start" && "items-start justify-start",
          align === "stretch" && "items-stretch",
          className
        )}
      >
        {children}
      </div>
      {label && <figcaption className="border-t border-subtle bg-default px-4 py-2 text-xs text-subtle">{label}</figcaption>}
    </figure>
  );
}

export function CodeBlock({ code, lang = "tsx" }: { code: string; lang?: string }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <div className="group relative overflow-hidden rounded-xl border border-subtle bg-inverted">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
        <span className="font-mono text-2xs uppercase tracking-wider text-inverted/60">{lang}</span>
        <button
          type="button"
          onClick={() => { navigator.clipboard?.writeText(code).catch(() => undefined); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
          className="inline-flex h-6 items-center gap-1 rounded-md px-2 text-xs text-inverted/70 hover:bg-white/10 hover:text-inverted focus-ring"
        >
          {copied ? <Check className="size-3.5" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[12.5px] leading-5 text-inverted/90"><code>{code.trim()}</code></pre>
    </div>
  );
}

/* ================================================================== */
/* Do / Don't                                                          */
/* ================================================================== */
export function DoDont({ dos, donts }: { dos: React.ReactNode[]; donts: React.ReactNode[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="overflow-hidden rounded-xl border border-success-border">
        <p className="flex items-center gap-2 bg-success-bg px-4 py-2.5 text-sm font-semibold text-success-fg"><Check className="size-4" aria-hidden /> Do</p>
        <ul className="grid gap-2.5 bg-default p-4 text-sm leading-5 text-default">
          {dos.map((d, i) => <li key={i} className="flex gap-2"><Check aria-hidden className="mt-0.5 size-4 shrink-0 text-success" />{d}</li>)}
        </ul>
      </div>
      <div className="overflow-hidden rounded-xl border border-error-border">
        <p className="flex items-center gap-2 bg-error-bg px-4 py-2.5 text-sm font-semibold text-error-fg"><XIcon className="size-4" aria-hidden /> Don't</p>
        <ul className="grid gap-2.5 bg-default p-4 text-sm leading-5 text-default">
          {donts.map((d, i) => <li key={i} className="flex gap-2"><XIcon aria-hidden className="mt-0.5 size-4 shrink-0 text-error" />{d}</li>)}
        </ul>
      </div>
    </div>
  );
}

/* ================================================================== */
/* Tables                                                              */
/* ================================================================== */
export function SpecTable({ head, rows, caption }: { head: string[]; rows: React.ReactNode[][]; caption?: string }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-subtle">
      <table className="w-full border-collapse text-left text-sm">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead className="bg-muted">
          <tr>{head.map((h) => <th key={h} scope="col" className="border-b border-subtle px-4 py-2.5 text-xs font-medium uppercase tracking-wide text-subtle">{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-subtle last:border-0">
              {r.map((c, j) => <td key={j} className={cn("px-4 py-2.5 align-top text-default", j === 0 && "font-medium text-emphasis")}>{c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function KeyboardTable({ rows }: { rows: [string, string][] }) {
  return (
    <SpecTable
      caption="Keyboard interactions"
      head={["Key", "Action"]}
      rows={rows.map(([k, a]) => [
        <span className="flex flex-wrap gap-1">{k.split(" / ").map((x) => <kbd key={x} className="rounded-sm border border-default bg-muted px-1.5 py-0.5 font-sans text-xs font-medium text-emphasis">{x}</kbd>)}</span>,
        a,
      ])}
    />
  );
}

export function Callout({ tone = "info", title, children }: { tone?: "info" | "attention" | "success" | "neutral"; title?: string; children: React.ReactNode }) {
  const t = { info: "border-info-border bg-info-bg text-info-fg", attention: "border-attention-border bg-attention-bg text-attention-fg", success: "border-success-border bg-success-bg text-success-fg", neutral: "border-subtle bg-muted text-default" }[tone];
  return (
    <div className={cn("rounded-xl border p-4 text-sm leading-6", t)}>
      {title && <p className="font-semibold">{title}</p>}
      <div className="[&_code]:rounded-sm [&_code]:bg-default/60 [&_code]:px-1 [&_code]:font-mono [&_code]:text-[0.85em]">{children}</div>
    </div>
  );
}

export const StatusBadge = ({ status }: { status: "stable" | "beta" | "new" | "deprecated" }) => (
  <Badge variant={{ stable: "success", beta: "attention", new: "info", deprecated: "error" }[status] as "success"} size="sm">
    {status}
  </Badge>
);

export function Token({ children }: { children: React.ReactNode }) {
  return <code className="whitespace-nowrap rounded-sm bg-subtle px-1 py-0.5 font-mono text-[12px] text-emphasis">{children}</code>;
}
