"use client";

import { auth } from "@/lib/firebaseClient";
import { onAuthStateChanged, signInAnonymously, User } from "firebase/auth";
import { useEffect, useRef, useState } from "react";

type UseAnonymousAuthResult = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
};

export function useAnonymousAuth(): UseAnonymousAuthResult {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const isSigningIn = useRef(false);

  useEffect(() => {
    let isMounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // prevent calling setState on an unmounted component
      if (!isMounted) return;

      if (user) {
        // User is logged in (either from cache or just signed in (using the anonymous sign in))
        setUser(user);
        setIsLoading(false);

        // release the lock
        isSigningIn.current = false;
      } else {
        // user is not logged in

        // for preventing race conditions (stop if we already have a running sign in)
        if (isSigningIn.current) return;

        // flag that we are in the sign in process
        isSigningIn.current = true;
        setIsLoading(true);

        try {
          // 5. Redundant Update Fix: Just wait for the promise.
          // We do NOT call setUser here. We let the onAuthStateChanged
          // listener (above) fire again when this completes.
          await signInAnonymously(auth);
        } catch (error) {
          if (!isMounted) return;

          setError(error as Error);
          setIsLoading(false);
          isSigningIn.current = false;
        }
      }
    });

    // when the component unmounts
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  return {
    user,
    isLoading,
    error,
  };
}
