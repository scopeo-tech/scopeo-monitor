/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const withAuth = (WrappedComponent : React.FC ) => {
  const AuthComponent = (props : React.ComponentProps<typeof WrappedComponent> ) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      const checkAuth = () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            router.replace("/auth/login");
          } else {
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error("Auth check failed:", error);
          router.replace("/auth/login");
        } finally {
          setIsLoading(false);
        }
      };
      
      checkAuth();
    }, [router]);

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      );
    }

    return isAuthenticated ? <WrappedComponent {...props} /> : null;
  };

  AuthComponent.displayName = `withAuth(${WrappedComponent.displayName || "Component"})`;
  return AuthComponent;
};

export default withAuth;