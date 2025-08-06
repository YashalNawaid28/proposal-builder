"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../../supabase/client";
import { useSearchParams } from "next/navigation";
import { getSiteUrl } from "../../../lib/utils";

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
      const { data: existingUser, error: checkError } = await supabase
        .from("users")
        .select("id, email, display_name, status")
        .eq("email", email.toLowerCase())
        .single();
      if (checkError || !existingUser) {
        setError(
          "Access denied. Please contact your administrator to get access."
        );
        setLoading(false);
        return;
      }

      // Check if user is disabled
      if (existingUser.status === "Disabled") {
        setError(
          "Your account has been disabled. Please contact your administrator for assistance."
        );
        setLoading(false);
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithOtp({
        email: email.toLowerCase(),
        options: {
          shouldCreateUser: false,
          emailRedirectTo: `${getSiteUrl()}/callback`,
        },
      });

      if (signInError) {
        setError(signInError.message);
      } else {
        setSuccess(
          "Magic link sent to your email! Check your inbox and click the link to sign in."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email to receive a magic link
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSendMagicLink}>
          <div>
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Email address"
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
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send Magic Link"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
