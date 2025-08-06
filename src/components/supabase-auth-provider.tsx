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
import { flushSync } from "react-dom";

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

  // Debug effect to monitor user state changes
  useEffect(() => {
    console.log("User state changed:", user);
    console.log("Session state changed:", session);
    console.log("UserData state changed:", userData);
  }, [user, session, userData]);

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
        console.log(
          "Session found, fetching user data for:",
          session.user.email
        );
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
      console.log("Previous user state:", user);
      console.log("Previous session state:", session);

      setSession(session);
      setUser(session?.user ?? null);

      // Fetch user data on sign in
      if (event === "SIGNED_IN" && session?.user?.email) {
        console.log(
          "User signed in, fetching user data for:",
          session.user.email
        );
        const userData = await fetchUserData(session.user.email);
        setUserData(userData);
      }

      // Handle sign-out event
      if (event === "SIGNED_OUT") {
        console.log("SIGNED_OUT event triggered - clearing state");
        setUserData(null);
        setUser(null);
        setSession(null);
        console.log("SIGNED_OUT event detected, redirecting...");
        // Force immediate redirect for all routes
        if (typeof window !== "undefined") {
          const currentPath = window.location.pathname;
          console.log("Redirecting from:", currentPath);
          window.location.replace("/sign-in");
        }
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [fetchUserData]);

  const signOut = useCallback(async () => {
    try {
      console.log("SignOut function called");
      console.log("Current session:", session);
      console.log("Current user:", user);

      // Clear state immediately and redirect
      flushSync(() => {
        setUser(null);
        setSession(null);
        setUserData(null);
      });

      console.log("State cleared immediately, redirecting...");
      window.location.replace("/sign-in");

      // Try to sign out from Supabase in the background (don't wait for it)
      supabase.auth.signOut().catch((error) => {
        console.error("Background Supabase signOut error:", error);
      });
    } catch (error) {
      console.error("Error signing out:", error);
      // Force clear state even on error with flushSync
      flushSync(() => {
        setUser(null);
        setSession(null);
        setUserData(null);
      });
      console.log("State cleared on error, redirecting...");
      window.location.replace("/sign-in");
    }
  }, [session, user]);

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
