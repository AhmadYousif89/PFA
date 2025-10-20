"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Provider = "google" | "github" | "microsoft";

export function LinkedAccountsTab() {
  // Placeholder state. Replace with data from your API.
  const [links, setLinks] = React.useState<Record<Provider, boolean>>({
    google: false,
    github: true,
    microsoft: false,
  });
  const [pending, setPending] = React.useState<Provider | null>(null);

  async function toggle(provider: Provider, next: boolean) {
    setPending(provider);
    try {
      // TODO: link/unlink via OAuth flow or API
      await new Promise((r) => setTimeout(r, 500));
      setLinks((l) => ({ ...l, [provider]: next }));
    } finally {
      setPending(null);
    }
  }

  const rows: { key: Provider; label: string }[] = [
    { key: "google", label: "Google" },
    { key: "github", label: "GitHub" },
    { key: "microsoft", label: "Microsoft" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Linked accounts</CardTitle>
        <CardDescription>Connect your social accounts for faster sign-in.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="divide-y rounded-md border">
          {rows.map(({ key, label }) => {
            const connected = links[key];
            return (
              <li key={key} className="flex items-center justify-between p-4">
                <div className="space-y-1">
                  <div className="font-medium">{label}</div>
                  <div className="text-muted-foreground text-sm">
                    {connected ? "Connected" : "Not connected"}
                  </div>
                </div>
                <div>
                  {connected ? (
                    <Button
                      variant="outline"
                      disabled={pending === key}
                      onClick={() => toggle(key, false)}
                    >
                      {pending === key ? "Unlinking..." : "Disconnect"}
                    </Button>
                  ) : (
                    <Button disabled={pending === key} onClick={() => toggle(key, true)}>
                      {pending === key ? "Linking..." : "Connect"}
                    </Button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
