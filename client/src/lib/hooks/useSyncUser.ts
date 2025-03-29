import { useEffect } from "react";
import { useUserStore } from "@/lib/stores/userStore";

export const useSyncUser = () => {
  const { setUser } = useUserStore();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "user") {
        setUser(event.newValue ? JSON.parse(event.newValue) : null);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [setUser]);
};
