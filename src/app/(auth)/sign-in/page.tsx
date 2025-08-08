"use client";
import { useState, useEffect } from "react";
import { createClient } from "../../../lib/supabase/client";
import { useSearchParams } from "next/navigation";
import { getSiteUrl } from "../../../lib/utils";
import { Input } from "../../../components/ui/input";
import Image from "next/image";
import { Label } from "@/components/ui/label";

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
      const supabase = createClient();
      let { data: existingUser, error: checkError } = await supabase
        .from("users")
        .select("id, email, display_name, status")
        .eq("email", email.toLowerCase())
        .single();
      if (checkError && checkError.code === "PGRST116") {
        const { data: users, error: searchError } = await supabase
          .from("users")
          .select("id, email, display_name, status")
          .ilike("email", `%${email}%`);
        if (!searchError && users && users.length > 0) {
          existingUser = users[0];
          checkError = null;
          console.log("Found user with case-insensitive search:", existingUser);
        }
      }
      if (checkError) {
        setError(
          "Access denied. Please contact your administrator to get access."
        );
        setLoading(false);
        return;
      }
      if (!existingUser) {
        setError(
          "Access denied. Please contact your administrator to get access."
        );
        setLoading(false);
        return;
      }
      if (existingUser.status === "Disabled") {
        setError(
          "Your account has been disabled. Please contact your administrator for assistance."
        );
        setLoading(false);
        return;
      }
      try {
        const syncResponse = await fetch("/api/sync-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email.toLowerCase() }),
        });
      } catch (syncError) {
        console.log(
          "User sync error, but continuing with sign-in attempt:",
          syncError
        );
      }
      const redirectUrl = `${getSiteUrl()}/callback`;
      const { error: signInError } = await supabase.auth.signInWithOtp({
        email: email.toLowerCase(),
        options: {
          shouldCreateUser: false,
          emailRedirectTo: redirectUrl,
          data: {
            name: existingUser.display_name || "User",
          },
        },
      });
      if (signInError) {
        console.error("Sign in error:", signInError);
        setError(signInError.message);
      } else {
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
    <div className="min-h-screen items-center justify-center bg-gray-50 flex flex-col">
      <div className="h-32 bg-black flex items-center justify-center w-full">
        <Image src="/images/logo.svg" alt="Logo" width={250} height={100} />
      </div>
      <section className="flex-1 max-w-md w-full flex items-center justify-center">
        <div className="w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-[30px] font-semibold text-gray-900">
              Sign in
            </h2>
            <h3 className="text-center text-sm text-gray-500">
              Please enter your email to receive link.
            </h3>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <Label className="text-sm mb-2">Email</Label>
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
      </section>
    </div>
  );
}
