import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { cn } from "@/lib/utils";
import { auth } from "./_lib/auth";
import { Card } from "@/components/ui/card";

import Logo from "public/assets/images/logo-large.svg";

export default async function AuthLayout({ children }: LayoutProps<"/">) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) redirect("/dashboard");

  return (
    <main className="bg-accent">
      <div className="container:flex-row mx-auto flex size-full max-w-(--site-max-w) flex-col">
        <header className="bg-foreground container:hidden flex justify-center rounded-b-md px-10 py-6 text-center">
          <Link href="/">
            <Logo />
          </Link>
        </header>
        <aside className="container:block hidden max-w-[37.5rem] p-5">
          <div
            className={cn(
              "flex h-full flex-col justify-between rounded-xl p-10",
              "bg-foreground bg-[url('/assets/images/illustration-authentication.svg')] bg-cover bg-center bg-no-repeat",
            )}
          >
            <Link href="/" className="inline-block w-fit">
              <Logo />
            </Link>
            <div className="text-primary-foreground space-y-6">
              <p className="text-xl font-bold">
                Keep track of your money <br /> and save for your future
              </p>
              <p className="text-sm">
                Personal finance app puts you in control of your spending. Track transactions, set
                budgets, and add to savings pots easily.
              </p>
            </div>
          </div>
        </aside>
        <div className="grid grow place-items-center px-4 py-6 md:px-10 md:py-8">
          <Card className="max-w-card min-h-80 w-full gap-8 px-5 md:p-8">{children}</Card>
        </div>
      </div>
    </main>
  );
}
