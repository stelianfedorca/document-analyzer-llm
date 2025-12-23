import { RefObject, useEffect, useRef } from "react";

interface UseReturnFocusOnCloseOptions {
  isOpen: boolean;
  containerRef: RefObject<HTMLElement | null>;
  triggerRef: RefObject<HTMLElement | null>;
}

export function useReturnFocusOnClose({
  isOpen,
  containerRef,
  triggerRef,
}: UseReturnFocusOnCloseOptions) {
  const prevIsOpenRef = useRef(isOpen);

  useEffect(() => {
    if (prevIsOpenRef.current && !isOpen) {
      const activeElement = document.activeElement;
      if (
        activeElement instanceof HTMLElement &&
        containerRef.current?.contains(activeElement)
      ) {
        // Return focus to the trigger if the menu closes while it has focus.
        triggerRef.current?.focus({ preventScroll: true });
      }
    }

    prevIsOpenRef.current = isOpen;
  }, [isOpen, containerRef, triggerRef]);
}
