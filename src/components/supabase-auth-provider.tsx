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
import { useRouter, usePathname } from "next/navigation";

interface UserData {
  id: string;
  display_name: string;
  email: string;
  avatar_url: string | null;
  last_active_at: string;
  created_at: string;
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
  const router = useRouter();
  const pathname = usePathname();

  // Client-side route protection
  useEffect(() => {
    if (!loading && !session) {
      const protectedRoutes = ['/jobs', '/users', '/signs', '/options', '/brands'];
      const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
      
      if (isProtectedRoute) {
        console.log('Client-side protection: Redirecting from', pathname);
        window.location.replace('/auth/sign-in');
      }
    }
  }, [session, loading, pathname]);

  useEffect(() => {
    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };
    getInitialSession();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      // Handle sign-out event
      if (event === 'SIGNED_OUT') {
        setUserData(null);
        console.log('SIGNED_OUT event detected, redirecting...');
        // Force immediate redirect for all protected routes
        if (typeof window !== 'undefined') {
          const currentPath = window.location.pathname;
          const protectedRoutes = ['/jobs', '/users', '/signs', '/options', '/brands'];
          const isProtectedRoute = protectedRoutes.some(route => currentPath.startsWith(route));
          if (isProtectedRoute) {
            console.log('Redirecting from protected route:', currentPath);
            window.location.replace('/auth/sign-in');
          }
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = useCallback(async () => {
    try {
      console.log('Signing out...');
      await supabase.auth.signOut();
      // Clear local state immediately
      setUser(null);
      setSession(null);
      setUserData(null);
      console.log('Sign-out completed, redirecting...');
      // Force a complete page reload to clear any cached state
      window.location.replace('/auth/sign-in');
    } catch (error) {
      console.error('Error signing out:', error);
      // Still redirect even if there's an error
      window.location.replace('/auth/sign-in');
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
