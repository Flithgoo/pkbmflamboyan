"use client";

import { useEffect } from "react";
import { useUserStore } from "@/src/store/useUserStore";
import { getUser } from "@/lib/api/user";

export default function UserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    async function fetchUser() {
      try {
        const { data, error } = await getUser();
        if (!error && data) {
          setUser({
            ...data,
            profile_picture:
              data.profile_picture === null ? "" : data.profile_picture,
          });
        }
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    }
    fetchUser();
  }, [setUser]);

  return <>{children}</>;
}
