"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../../supabase/client";
import { useSearchParams } from "next/navigation";
import { getSiteUrl } from "../../../lib/utils";
import { Input } from "../../../components/ui/input";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const searchParams = useSearchParams();

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam === "access_denied") {
      setError(
        "Access denied. Please contact your administrator to get access."
      );
    } else if (errorParam === "auth_failed") {
      setError("Authentication failed. Please try again.");
    } else if (errorParam === "account_disabled") {
      setError(
        "Your account has been disabled. Please contact your administrator for assistance."
      );
    }
  }, [searchParams]);

  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      console.log("Attempting to sign in with email:", email.toLowerCase());

      // First try exact match
      let { data: existingUser, error: checkError } = await supabase
        .from("users")
        .select("id, email, display_name, status")
        .eq("email", email.toLowerCase())
        .single();

      console.log("User lookup result:", { existingUser, checkError });

      // If no exact match, try case-insensitive search
      if (checkError && checkError.code === "PGRST116") {
        console.log("No exact match found, trying case-insensitive search");
        const { data: users, error: searchError } = await supabase
          .from("users")
          .select("id, email, display_name, status")
          .ilike("email", `%${email}%`);

        console.log("Case-insensitive search result:", { users, searchError });

        if (!searchError && users && users.length > 0) {
          existingUser = users[0];
          checkError = null;
          console.log("Found user with case-insensitive search:", existingUser);
        }
      }

      if (checkError) {
        console.error("Database error:", checkError);
        setError(
          "Access denied. Please contact your administrator to get access."
        );
        setLoading(false);
        return;
      }

      if (!existingUser) {
        console.log("No user found in database");
        setError(
          "Access denied. Please contact your administrator to get access."
        );
        setLoading(false);
        return;
      }

      console.log("User found:", existingUser);

      // Check if user is disabled
      if (existingUser.status === "Disabled") {
        console.log("User is disabled");
        setError(
          "Your account has been disabled. Please contact your administrator for assistance."
        );
        setLoading(false);
        return;
      }

      console.log("User is active, syncing with auth system if needed");

      // Try to sync user with auth system if they don't exist there
      try {
        const syncResponse = await fetch("/api/sync-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email.toLowerCase() }),
        });

        if (syncResponse.ok) {
          const syncResult = await syncResponse.json();
          console.log("User sync result:", syncResult);
        } else {
          console.log("User sync failed, but continuing with sign-in attempt");
        }
      } catch (syncError) {
        console.log("User sync error, but continuing with sign-in attempt:", syncError);
      }

      console.log("Sending magic link");

      const { error: signInError } = await supabase.auth.signInWithOtp({
        email: email.toLowerCase(),
        options: {
          shouldCreateUser: false, // Don't create new users, only use existing ones
          emailRedirectTo: `${getSiteUrl()}/callback`,
        },
      });

      if (signInError) {
        console.error("Sign in error:", signInError);
        setError(signInError.message);
      } else {
        console.log("Magic link sent successfully");
        setSuccess(
          "Magic link sent to your email! Check your inbox and click the link to sign in."
        );
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    handleSendMagicLink(e);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-[24px] font-bold text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          {success && (
            <div className="rounded-md bg-green-50 p-4">
              <div className="text-sm text-green-700">{success}</div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send Email"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
