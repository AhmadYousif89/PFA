import type { Metadata } from "next";
import { headers } from "next/headers";

import { auth } from "@/app/(auth)/_lib/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

import UserIcon from "public/assets/images/icon-user.svg";
import ShieldIcon from "public/assets/images/icon-shield.svg";
import KeyIcon from "public/assets/images/icon-key.svg";
import TrashIcon from "public/assets/images/icon-trash.svg";

import { ProfileTab } from "./_components/profile-update-form";
import { SecurityTab } from "./_components/security-tab";
import { SessionManagement } from "./_components/sessions-managment";
import { AccountTab } from "./_components/account-deletion";
import { ProfileHeader } from "./_components/header";

export const metadata: Metadata = {
  title: "Profile - Personal Finance App",
  description: "Manage your profile settings and personal information.",
};

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  return (
    <div className="xl:max-w-page flex grow flex-col gap-8">
      <header className="border-border/20 flex flex-col gap-1 border-b pb-2">
        <h1 className="text-xl font-bold">Profile</h1>
        <p className="text-muted-foreground text-xs font-medium md:text-sm">
          Manage your profile settings and personal information.
        </p>
      </header>
      <section aria-label="User profile and settings" className="flex flex-col gap-8">
        <ProfileHeader />

        <Card className="p-4 md:p-6">
          <Tabs aria-label="Profile settings tabs" defaultValue="profile" className="gap-0">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">
                <UserIcon className="size-5" />
                <span className="max-sm:hidden">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="security">
                <ShieldIcon className="size-5" />
                <span className="max-sm:hidden">Security</span>
              </TabsTrigger>
              <TabsTrigger value="sessions">
                <KeyIcon />
                <span className="max-sm:hidden">Sessions</span>
              </TabsTrigger>
              <TabsTrigger value="danger">
                <TrashIcon />
                <span className="max-sm:hidden">Danger</span>
              </TabsTrigger>
            </TabsList>

            <div className="py-6">
              <TabsContent value="profile">
                <ProfileTab user={session.user} />
              </TabsContent>
              <TabsContent value="security" className="flex flex-col gap-8">
                <SecurityTab email={session.user.email} />
              </TabsContent>
              <TabsContent value="sessions">
                <SessionsTab currentSessionToken={session.session.token} />
              </TabsContent>
              <TabsContent value="danger">
                <AccountTab />
              </TabsContent>
            </div>
          </Tabs>
        </Card>
      </section>
    </div>
  );
}

async function SessionsTab({ currentSessionToken }: { currentSessionToken: string }) {
  const sessions = await auth.api.listSessions({ headers: await headers() });
  return <SessionManagement sessions={sessions} currentSessionToken={currentSessionToken} />;
}
