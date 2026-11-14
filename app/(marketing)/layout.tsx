import { SiteFooter, SiteHeader } from "@/components/Brand";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (<><SiteHeader /><main className="flex-1">{children}</main><SiteFooter /></>);
}
