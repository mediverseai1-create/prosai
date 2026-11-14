import { redirect } from "next/navigation";
import { createClient, createAdminClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { billingPeriodStart, getPlan } from "@/lib/plans";

export async function getContext() {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: m } = await supabase
    .from("memberships")
    .select("org_id, organizations(id, name, icp)")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();
  if (!m) return null;
  const org = m.organizations as unknown as { id: string; name: string; icp: string };
  const { data: sub } = await supabase
    .from("subscriptions").select("plan, status").eq("org_id", org.id).maybeSingle();
  const plan = getPlan(sub?.status === "active" ? sub.plan : "free");
  return { supabase, user, org, plan, status: sub?.status ?? "active" };
}

export async function requireContext() {
  const ctx = await getContext();
  if (!ctx) redirect("/login");
  return ctx;
}

export async function creditsUsed(orgId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("usage_events").select("credits")
    .eq("org_id", orgId).gte("created_at", billingPeriodStart().toISOString());
  return (data ?? []).reduce((n, r) => n + r.credits, 0);
}

export async function recordUsage(orgId: string, userId: string, kind: string, credits: number) {
  if (credits <= 0) return;
  await createAdminClient().from("usage_events").insert({ org_id: orgId, user_id: userId, kind, credits });
}
