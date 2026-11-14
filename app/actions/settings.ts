"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireContext } from "@/lib/session";
import type { FormState } from "@/app/actions/auth";

const schema = z.object({
  name: z.string().trim().min(1, "Workspace name is required.").max(80),
  icp: z.string().trim().max(1500, "Keep the profile under 1,500 characters."),
});

export async function saveSettings(_: FormState, fd: FormData): Promise<FormState> {
  const ctx = await requireContext();
  const p = schema.safeParse(Object.fromEntries(fd));
  if (!p.success) return { error: p.error.issues[0].message };
  const { error } = await ctx.supabase.from("organizations").update(p.data).eq("id", ctx.org.id);
  if (error) return { error: "Could not save settings." };
  revalidatePath("/app", "layout");
  return { message: "Saved." };
}
