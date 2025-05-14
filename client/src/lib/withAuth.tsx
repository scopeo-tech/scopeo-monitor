/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const withAuth = (WrappedComponent: React.FC) => {
  const AuthComponent = (props: React.ComponentProps<typeof WrappedComponent>) => {
    const router = useRouter();
    const [authChecked, setAuthChecked] = useState(false);

    useEffect(() => {
      const checkAuth = () => {
        const token = localStorage.getItem("token");
        if (!token) {
          router.replace("/auth/login");
        } else {
          setAuthChecked(true);
        }
      };

      try {
        checkAuth();
      } catch (error) {
        console.error("Auth check failed:", error);
        router.replace("/auth/login");
      }
    }, [router]);
    if (!authChecked) return null;
  
    return <WrappedComponent {...props} />;
  };

  AuthComponent.displayName = `withAuth(${WrappedComponent.displayName || "Component"})`;

  return AuthComponent;
};

export default withAuth;