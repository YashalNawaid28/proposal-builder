"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
  type ReactNode,
} from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "../supabase/client";
import { usePathname } from "next/navigation";

interface UserData {
  id: string;
  display_name: string;
  email: string;
  avatar_url: string | null;
  last_active_at: string;
  created_at: string;
  job_title?: string;
  role?: string;
  status?: string;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  session: null,
  loading: true,
  signOut: async () => {},
});

export function SupabaseAuthProvider({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  const fetchUserData = useCallback(async (email: string) => {
    try {
      console.log("Fetching user data for email:", email);
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();

      if (error) {
        console.error("Error fetching user data:", error);
        return null;
      }

      console.log("User data fetched successfully:", data);
      return data as UserData;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  }, []);

  // Client-side route protection
  useEffect(() => {
    if (!loading && !session) {
      const protectedRoutes = [
        "/jobs",
        "/users",
        "/signs",
        "/options",
        "/brands",
      ];
      const isProtectedRoute = protectedRoutes.some((route) =>
        pathname.startsWith(route)
      );

      if (isProtectedRoute) {
        console.log("Client-side protection: Redirecting from", pathname);
        window.location.replace("/sign-in");
      }
    }
  }, [session, loading, pathname]);

  useEffect(() => {
    const getInitialSession = async () => {
      console.log("Getting initial session...");
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);

      // Fetch user data if session exists
      if (session?.user?.email) {
        console.log("Session found, fetching user data for:", session.user.email);
        const userData = await fetchUserData(session.user.email);
        setUserData(userData);
      } else {
        console.log("No session found");
      }

      setLoading(false);
    };
    getInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event, session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);

      // Fetch user data on sign in
      if (event === "SIGNED_IN" && session?.user?.email) {
        console.log("User signed in, fetching user data for:", session.user.email);
        const userData = await fetchUserData(session.user.email);
        setUserData(userData);
      }

      // Handle sign-out event
      if (event === "SIGNED_OUT") {
        setUserData(null);
        console.log("SIGNED_OUT event detected, redirecting...");
        // Force immediate redirect for all protected routes
        if (typeof window !== "undefined") {
          const currentPath = window.location.pathname;
          const protectedRoutes = [
            "/jobs",
            "/users",
            "/signs",
            "/options",
            "/brands",
          ];
          const isProtectedRoute = protectedRoutes.some((route) =>
            currentPath.startsWith(route)
          );
          if (isProtectedRoute) {
            console.log("Redirecting from protected route:", currentPath);
            window.location.replace("/sign-in");
          }
        }
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [fetchUserData]);

  const signOut = useCallback(async () => {
    try {
      console.log("Signing out...");
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setUserData(null);
      window.location.replace("/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
      window.location.replace("/sign-in");
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      userData,
      session,
      loading,
      signOut,
    }),
    [user, userData, session, loading, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a SupabaseAuthProvider");
  }
  return context;
};
