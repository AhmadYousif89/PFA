"use client";

import { useCallback, useRef } from "react";

// Hook to prevent dialog from closing when interacting with touch-enabled select components
export function useBlockOutsideInteractionOnTouch() {
  const touchEndedRef = useRef(false);

  const onTouchEnd = useCallback<React.TouchEventHandler>(() => (touchEndedRef.current = true), []);
  const onInteractOutside = useCallback((e: Event) => {
    if (touchEndedRef.current) {
      e.preventDefault();
      touchEndedRef.current = false;
    }
  }, []);

  return { onTouchEnd, onInteractOutside };
}
