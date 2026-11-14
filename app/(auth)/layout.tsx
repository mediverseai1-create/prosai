import { Logo } from "@/components/Brand";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4 py-12">
      <div className="mb-8"><Logo /></div>
      <div className="card p-6 sm:p-8">{children}</div>
    </main>
  );
}
