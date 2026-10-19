"use client";

import * as React from "react";
import { Upload } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/alert-dialog";
import { FormControl, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { currentUser } from "./data";

const NOTIFY = [
  { id: "product", title: "Product updates", description: "New features and release notes." },
  { id: "billing", title: "Billing", description: "Invoices, failed payments and plan changes." },
  { id: "security", title: "Security alerts", description: "New sign-ins and password changes. Always on.", locked: true },
  { id: "digest", title: "Weekly digest", description: "A Monday summary of your workspace." },
];

/**
 * Block · Account settings (shadcnstudio "Account Settings").
 * Tabs → Profile (validated form) · Notifications (switch list) · Danger zone (confirm dialog).
 * Validation runs on submit, errors are linked with aria-describedby and focus moves to the first invalid field.
 */
export function AccountSettings() {
  const [name, setName] = React.useState(currentUser.name);
  const [email, setEmail] = React.useState(currentUser.email);
  const [errors, setErrors] = React.useState<{ name?: string; email?: string }>({});
  const [saving, setSaving] = React.useState(false);
  const formRef = React.useRef<HTMLFormElement>(null);
  const focusInvalid = React.useRef(false);
  // Move focus after React has rendered aria-invalid (WCAG 3.3.1 — errors are announced where they are).
  React.useEffect(() => {
    if (!focusInvalid.current) return;
    focusInvalid.current = false;
    formRef.current?.querySelector<HTMLElement>("[aria-invalid=true]")?.focus();
  }, [errors]);
  const [prefs, setPrefs] = React.useState<Record<string, boolean>>({ product: true, billing: true, security: true, digest: false });

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!name.trim()) next.name = "Enter your display name.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) next.email = "Enter an email like name@company.com.";
    setErrors(next);
    if (Object.keys(next).length) {
      focusInvalid.current = true;
      return;
    }
    setSaving(true);
    setTimeout(() => { setSaving(false); toast.success("Profile updated"); }, 600);
  };

  return (
    <Tabs defaultValue="profile" className="grid w-full max-w-3xl gap-6">
      <TabsList>
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="danger">Danger zone</TabsTrigger>
      </TabsList>

      <TabsContent value="profile">
        <Card>
          <form ref={formRef} onSubmit={submit} noValidate className="grid gap-6">
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>This is how others will see you in the workspace.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="flex items-center gap-4">
                <Avatar name={name || "?"} size="xl" />
                <div className="grid gap-1.5">
                  <Button type="button" variant="outline" size="sm" className="w-fit"><Upload aria-hidden /> Upload photo</Button>
                  <p className="text-xs text-muted-foreground">PNG or JPG, at least 256×256.</p>
                </div>
              </div>
              <Separator />
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField label="Display name" error={errors.name} required>
                  <FormControl><Input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" /></FormControl>
                </FormField>
                <FormField label="Email" hint="Used for sign-in and receipts." error={errors.email} required>
                  <FormControl><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" /></FormControl>
                </FormField>
                <FormField label="Workspace URL">
                  <FormControl><Input addonStart="agere.id/" defaultValue="bubus" /></FormControl>
                </FormField>
                <FormField label="Language">
                  <Select defaultValue="id">
                    <SelectTrigger aria-label="Language"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="id">Bahasa Indonesia</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
              </div>
              <FormField label="Bio" hint="Up to 160 characters." optional>
                <FormControl><Textarea maxLength={160} placeholder="Product designer at agere…" /></FormControl>
              </FormField>
            </CardContent>
            <CardFooter className="justify-end gap-2 border-t pt-6">
              <Button type="button" variant="ghost" onClick={() => { setName(currentUser.name); setEmail(currentUser.email); setErrors({}); }}>Reset</Button>
              <Button type="submit" loading={saving}>{saving ? "Saving…" : "Save changes"}</Button>
            </CardFooter>
          </form>
        </Card>
      </TabsContent>

      <TabsContent value="notifications">
        <Card>
          <CardHeader>
            <CardTitle>Email notifications</CardTitle>
            <CardDescription>Choose what we email you about. Changes save immediately.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {NOTIFY.map((n) => {
              const id = `notify-${n.id}`;
              return (
                <div key={n.id} className="flex items-center justify-between gap-4 rounded-lg border border-border p-4">
                  <div className="grid gap-1">
                    <label htmlFor={id} className="text-sm font-medium leading-none">{n.title}</label>
                    <p id={`${id}-d`} className="text-sm text-muted-foreground">{n.description}</p>
                  </div>
                  <Switch
                    id={id}
                    aria-describedby={`${id}-d`}
                    checked={prefs[n.id]}
                    disabled={n.locked}
                    onCheckedChange={(v) => { setPrefs((p) => ({ ...p, [n.id]: v })); toast(`${n.title} ${v ? "on" : "off"}`); }}
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="danger">
        <Card className="border-destructive/40">
          <CardHeader>
            <CardTitle>Delete workspace</CardTitle>
            <CardDescription>Permanently removes agere, its 3 projects and 1,284 records. This cannot be undone.</CardDescription>
          </CardHeader>
          <CardFooter className="justify-end">
            <ConfirmDialog
              trigger={<Button variant="destructive">Delete workspace</Button>}
              title="Delete agere?"
              description="All projects, members and billing history will be deleted immediately. Export anything you need first."
              confirmLabel="Delete workspace"
              onConfirm={() => toast.error("Workspace deleted (demo)")}
            />
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
