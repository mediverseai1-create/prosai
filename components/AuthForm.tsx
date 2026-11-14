"use client";

import { useActionState } from "react";
import type { FormState } from "@/app/actions/auth";

type Field = { name: string; label: string; type: string; autoComplete?: string };

export function AuthForm({
  action, fields, submit, next,
}: {
  action: (s: FormState, fd: FormData) => Promise<FormState>;
  fields: Field[];
  submit: string;
  next?: string;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  return (
    <form action={formAction} className="space-y-4" noValidate>
      {next && <input type="hidden" name="next" value={next} />}
      {fields.map((f) => (
        <label key={f.name} className="block text-sm font-medium">
          {f.label}
          <input className="input mt-1.5" name={f.name} type={f.type} autoComplete={f.autoComplete} required />
        </label>
      ))}
      {state.error && <p role="alert" className="rounded-lg bg-rose/60 px-3 py-2 text-sm text-ink">{state.error}</p>}
      {state.message && <p role="status" className="rounded-lg bg-lime/60 px-3 py-2 text-sm text-ink">{state.message}</p>}
      <button className="btn btn-primary w-full" disabled={pending}>{pending ? "Working…" : submit}</button>
    </form>
  );
}
