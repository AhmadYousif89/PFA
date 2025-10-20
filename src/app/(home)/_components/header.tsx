import Link from "next/link";

import { Button } from "@/components/ui/button";
import Logo from "public/assets/images/logo-large.svg";
import { auth } from "../../(auth)/_lib/auth";
import { headers } from "next/headers";

export const HomeHeader = async ({ stashId }: { stashId?: string }) => {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id ? session.user.id : null;
  const userHasFinalized = session?.user?.hasFinalized;

  return (
    <header className="max-w-site site:px-0 z-50 mx-auto flex w-full items-center justify-between px-4 py-6 md:px-8">
      <Link href="/">
        <Logo className="*:fill-foreground" />
      </Link>
      <Button asChild size="lg">
        {userId ? (
          <Link href="/dashboard">
            {userHasFinalized ? "Go to Dashboard" : "Continue Onboarding"}
          </Link>
        ) : (
          <Link href={stashId ? "sign-up" : "sign-in"}>
            {stashId ? "Continue Onboarding" : "Sign In"}
          </Link>
        )}
      </Button>
    </header>
  );
};
