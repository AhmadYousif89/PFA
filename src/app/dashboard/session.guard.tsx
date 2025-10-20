"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { getSession, useSession } from "@/app/(auth)/_lib/auth.client";
import { SessionExpiredModal } from "@/components/modals/session-expired.modal";

type Props = { children: React.ReactNode };

export function SessionGuard({ children }: Props) {
  const pathname = usePathname();
  const inFlightRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [showExpiredModal, setShowExpiredModal] = useState(false);

  const { data } = useSession();

  useEffect(() => {
    if (!data?.session) return; // No session checks in demo mode

    const checkStatus = async () => {
      if (inFlightRef.current) return;
      inFlightRef.current = true;

      try {
        const session = await getSession();
        if (session.data == null) {
          setShowExpiredModal(true);
        }
      } catch (err) {
        console.error("Error checking auth status", err);
        setShowExpiredModal(true); // Assume session expired if error
      } finally {
        inFlightRef.current = false;
      }
    };
    // Initial check on mount/route change
    checkStatus();
    // Debounce to avoid a request per click/keypress
    const handleActivity = () => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(checkStatus, 3000);
    };
    // Re-check when tab gains focus
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
  }, [pathname, data?.session]);

  return (
    <>
      {children}
      <SessionExpiredModal isOpen={showExpiredModal} />
    </>
  );
}
