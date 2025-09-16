"use client";

import { useState, useEffect, Suspense } from "react";
import { supabase } from "@/config/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Verify the token is present in the URL
    const token = searchParams.get("token");
    if (!token) {
      setError("Invalid or missing reset token");
    }
  }, [searchParams]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const token = searchParams.get("token");
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      setSuccess(true);
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/auth/login");
      }, 3000);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white font-heading">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Enter your new password below
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="password" className="sr-only">
                New Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-secondary placeholder-gray-500 text-white bg-black rounded-t-md focus:outline-none focus:ring-secondary focus:border-secondary focus:z-10 sm:text-sm"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="sr-only">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-secondary placeholder-gray-500 text-white bg-black rounded-b-md focus:outline-none focus:ring-secondary focus:border-secondary focus:z-10 sm:text-sm"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          {success && (
            <div className="text-green-500 text-sm text-center">
              Password reset successful! Redirecting to login...
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading || success}
              className="group relative w-full flex justify-center py-2.5 px-5 border border-transparent text-sm font-medium rounded-md text-white bg-secondary hover:bg-secondary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-all duration-200"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </div>

          <div className="text-center">
            <Link
              href="/auth/login"
              className="font-medium text-secondary hover:text-secondary-light"
            >
              Back to login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ResetPassword() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-black">
          Loading...
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
