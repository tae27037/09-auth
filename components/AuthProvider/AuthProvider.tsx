"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { checkSession } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

type Props = {
  children: React.ReactNode;
};

const privateRoutes = ["/profile", "/notes"];

export default function AuthProvider({ children }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const setUser = useAuthStore((state) => state.setUser);
  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated,
  );

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function validateSession() {
      try {
        const user = await checkSession();

        if (user) {
          setUser(user);
        } else {
          clearIsAuthenticated();

          const isPrivateRoute = privateRoutes.some((route) =>
            pathname.startsWith(route),
          );

          if (isPrivateRoute) {
            router.replace("/sign-in");
            return;
          }
        }
      } catch {
        clearIsAuthenticated();

        const isPrivateRoute = privateRoutes.some((route) =>
          pathname.startsWith(route),
        );

        if (isPrivateRoute) {
          router.replace("/sign-in");
          return;
        }
      } finally {
        setIsLoading(false);
      }
    }

    validateSession();
  }, [pathname, router, setUser, clearIsAuthenticated]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return <>{children}</>;
}
