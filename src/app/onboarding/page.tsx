import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "../(auth)/_lib/auth";
import { FinancialProfileSetup } from "./form";
import Logo from "public/assets/images/logo-large.svg";

export default async function OnboardingPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/");
  }
  if (session.user?.hasFinalized) {
    redirect("/dashboard");
  }

  return (
    <div className="bg-accent flex min-h-dvh flex-col">
      <header className="max-w-site site:px-0 z-50 mx-auto flex min-h-20 w-full items-center justify-between px-4 py-6 md:px-8">
        <Link href="/">
          <Logo className="*:fill-foreground" />
        </Link>
      </header>
      <main className="max-w-site relative isolate mx-auto w-full p-4 md:p-8">
        {/* Grid Background */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div
            className="absolute inset-0 bg-[linear-gradient(to_right,#277C7815_1px,transparent_1px),linear-gradient(to_bottom,#277C7815_1px,transparent_1px)] bg-[size:30px_30px]"
            style={{
              maskImage: "radial-gradient(ellipse 100% 50% at 50% 0%, #000 80%, transparent 200%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 100% 50% at 50% 0%, #000 80%, transparent 200%)",
            }}
          />
        </div>
        <FinancialProfileSetup />
      </main>
    </div>
  );
}
