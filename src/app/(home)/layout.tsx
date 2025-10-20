import { headers } from "next/headers";
import { auth } from "../(auth)/_lib/auth";
import { redirect } from "next/navigation";

export default async function HomeLayout({ children }: LayoutProps<"/">) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session && session.user.hasFinalized) {
    redirect("/dashboard");
  }
  return <div className="bg-accent relative isolate flex min-h-dvh flex-col">{children}</div>;
}
