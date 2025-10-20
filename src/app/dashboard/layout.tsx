import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "../(auth)/_lib/auth";
import { DemoModeProvider } from "@/contexts/demo.context";
import { SessionGuard } from "@/app/dashboard/session.guard";
import { NavigationMenu } from "@/components/navigation/navigation";

export const metadata: Metadata = {
  title: "Dashboard - Personal Finance App",
  description:
    "Manage your personal finances with ease using our app. Track expenses, set budgets, and achieve your financial goals.",
};

export default async function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  const hdrs = await headers();

  const [session, isDemo] = await Promise.all([
    auth.api.getSession({ headers: hdrs }),
    auth.api.checkDemoCookie({ headers: hdrs }),
  ]);

  if (!(isDemo || session)) redirect("/");

  if (session && !session.user.hasFinalized) {
    redirect("/onboarding");
  }

  return (
    <SessionGuard>
      <DemoModeProvider isUser={!!session}>
        <div className="from-foreground to-accent relative isolate bg-gradient-to-r from-50% to-50%">
          {/* Grid Background */}
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div
              className="absolute inset-0 bg-[linear-gradient(to_right,#277C7820_1px,transparent_1px),linear-gradient(to_bottom,#277C7820_1px,transparent_1px)] bg-[size:30px_30px]"
              style={{
                // Grid fades out towards the right edge
                maskImage:
                  "linear-gradient(to right, transparent 0%, #000 0%, #000 0%, transparent 25%)",
                WebkitMaskImage:
                  "linear-gradient(to right, transparent 0%, #000 0%, #000 0%, transparent 25%)",
              }}
            />
          </div>
          <div className="bg-accent mx-auto flex size-full max-w-(--site-max-w) grow flex-col transition-all duration-300 will-change-contents xl:flex-row">
            <main className="xl:ring-foreground/5 flex grow flex-col overflow-hidden px-4 py-6 md:px-10 md:py-8">
              {children}
            </main>
            <NavigationMenu />
          </div>
        </div>
      </DemoModeProvider>
    </SessionGuard>
  );
}
