"use client";

import { useRouter } from "next/navigation";
import { createContext, useMemo, useState, use, useEffect, useRef } from "react";

import { checkDemoCookieClient } from "@/app/(auth)/_lib/auth.client";
import { DemoSessionExpiredModal } from "@/components/modals/demo-session-expired.modal";

type Ctx = { isDemo: boolean; setIsDemo: (v: boolean) => void };

const DemoModeCtx = createContext<Ctx | null>(null);

type Props = { isUser: boolean; children: React.ReactNode };

export function DemoModeProvider({ isUser, children }: Props) {
  const router = useRouter();
  const inFlightRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [isDemo, setIsDemo] = useState(false);
  const [showDemoExpired, setShowDemoExpired] = useState(false);

  useEffect(() => {
    if (isUser) return;
    checkDemoCookieClient().then((hasCookie) => {
      setIsDemo(hasCookie);
      if (!hasCookie) setShowDemoExpired(true);
    });
  }, [isUser]);

  useEffect(() => {
    // Restart effect when demo mode or modal state changes
    const shouldPoll = isDemo || showDemoExpired;
    if (!shouldPoll) return;

    const checkStatus = async () => {
      if (inFlightRef.current) return;
      inFlightRef.current = true;
      try {
        const hasCookie = await checkDemoCookieClient();
        if (hasCookie && !isDemo) {
          // Demo restarted -> hide modal and refresh server data
          setIsDemo(true);
          setShowDemoExpired(false);
          router.refresh();
        } else if (!hasCookie && isDemo) {
          // Demo expired -> show modal
          setIsDemo(false);
          setShowDemoExpired(true);
        }
      } finally {
        inFlightRef.current = false;
      }
    };
    // Initial check
    checkStatus();

    const handleActivity = () => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(checkStatus, 2000);
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible") checkStatus();
    };

    window.addEventListener("keydown", handleActivity);
    window.addEventListener("click", handleActivity);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      clearTimeout(timeoutRef.current);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("click", handleActivity);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [showDemoExpired, isDemo, router]);

  const value = useMemo(() => ({ isDemo, setIsDemo }), [isDemo]);

  return (
    <DemoModeCtx.Provider value={value}>
      {children}
      <DemoSessionExpiredModal isOpen={showDemoExpired} />
    </DemoModeCtx.Provider>
  );
}

export function useDemoMode() {
  const ctx = use(DemoModeCtx);
  if (!ctx) throw new Error("useDemoMode must be used within DemoModeProvider");
  return ctx;
}
