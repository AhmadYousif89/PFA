"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};
export default function Error({ error, reset }: ErrorProps) {
  return (
    <main className="bg-accent relative isolate flex min-h-dvh flex-col">
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
      <div className="max-w-container mx-auto mt-8 flex w-full grow flex-col gap-8 p-4 md:my-16 md:p-8 xl:my-24">
        <h1 className="text-foreground text-xl font-bold">Something went wrong!</h1>
        <p className="text-muted-foreground">Error: {error.message}</p>
        <div className="flex items-center gap-4">
          <Button size="lg" className="self-start" onClick={() => reset()}>
            Try again
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/">Go home</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
