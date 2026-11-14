"use client";

import { useActionState } from "react";
import { saveSettings } from "@/app/actions/settings";

export function SettingsForm({ name, icp }: { name: string; icp: string }) {
  const [state, action, pending] = useActionState(saveSettings, {});
  return (
    <form action={action} className="card mt-6 space-y-4 p-6">
      <label className="block text-sm font-medium">Workspace name
        <input className="input mt-1.5" name="name" defaultValue={name} maxLength={80} required />
      </label>
      <label className="block text-sm font-medium">Ideal customer profile
        <textarea className="input mt-1.5 min-h-32" name="icp" defaultValue={icp} maxLength={1500}
          placeholder="e.g. B2B SaaS companies with 50–500 employees selling to finance teams in North America." />
        <span className="mt-1 block text-xs font-normal text-muted">AI research uses this to judge each lead&apos;s fit.</span>
      </label>
      {state.error && <p role="alert" className="rounded-lg bg-rose/60 px-3 py-2 text-sm">{state.error}</p>}
      {state.message && <p role="status" className="rounded-lg bg-lime/60 px-3 py-2 text-sm">{state.message}</p>}
      <button className="btn btn-primary" disabled={pending}>{pending ? "Saving…" : "Save changes"}</button>
    </form>
  );
}
