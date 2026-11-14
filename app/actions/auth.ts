"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export type FormState = { error?: string; message?: string };

const email = z.string().trim().email("Enter a valid email address.");
const password = z.string().min(8, "Use at least 8 characters.").max(72);
const NOT_CONFIGURED: FormState = { error: "Supabase is not configured yet. Add the environment variables from .env.example." };

function safeNext(v: FormDataEntryValue | null) {
  const s = typeof v === "string" ? v : "";
  return s.startsWith("/") && !s.startsWith("//") ? s : "/app";
}

async function origin() {
  const h = await headers();
  return process.env.NEXT_PUBLIC_SITE_URL || h.get("origin") || "http://localhost:3000";
}

export async function signIn(_: FormState, fd: FormData): Promise<FormState> {
  if (!isSupabaseConfigured()) return NOT_CONFIGURED;
  const p = z.object({ email, password: z.string().min(1, "Enter your password.") }).safeParse(Object.fromEntries(fd));
  if (!p.success) return { error: p.error.issues[0].message };
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(p.data);
  if (error) return { error: "Incorrect email or password." };
  redirect(safeNext(fd.get("next")));
}

export async function signUp(_: FormState, fd: FormData): Promise<FormState> {
  if (!isSupabaseConfigured()) return NOT_CONFIGURED;
  const p = z.object({ email, password }).safeParse(Object.fromEntries(fd));
  if (!p.success) return { error: p.error.issues[0].message };
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    ...p.data,
    options: { emailRedirectTo: `${await origin()}/auth/callback` },
  });
  if (error) return { error: error.message };
  if (!data.session) return { message: "Check your inbox to confirm your email, then sign in." };
  redirect("/app");
}

export async function forgotPassword(_: FormState, fd: FormData): Promise<FormState> {
  if (!isSupabaseConfigured()) return NOT_CONFIGURED;
  const p = z.object({ email }).safeParse(Object.fromEntries(fd));
  if (!p.success) return { error: p.error.issues[0].message };
  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(p.data.email, {
    redirectTo: `${await origin()}/auth/callback?next=/reset-password`,
  });
  // Same response whether or not the account exists.
  return { message: "If that email has an account, a reset link is on its way." };
}

export async function resetPassword(_: FormState, fd: FormData): Promise<FormState> {
  if (!isSupabaseConfigured()) return NOT_CONFIGURED;
  const p = z.object({ password }).safeParse(Object.fromEntries(fd));
  if (!p.success) return { error: p.error.issues[0].message };
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: p.data.password });
  if (error) return { error: "This reset link has expired. Request a new one." };
  redirect("/app");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
