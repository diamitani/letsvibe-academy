"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";

const signupSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignupInput = z.infer<typeof signupSchema>;

const NAVY = "bg-[#0B2545] hover:bg-[#12325E]";
const INPUT =
  "mt-1 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-[#0B2545] focus:outline-none focus:ring-2 focus:ring-[#0B2545]/20";

export default function SignupPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({ resolver: zodResolver(signupSchema) });

  async function onSubmit(values: SignupInput) {
    setServerError(null);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
    });
    if (error) {
      setServerError(error.message);
      return;
    }
    if (data.session) {
      // Signed in immediately (email confirmation disabled).
      router.push("/academy");
      router.refresh();
    } else {
      // Email confirmation required — user must click the link first.
      setNeedsConfirmation(true);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
        <p className="mt-1 text-sm text-slate-500">
          Free forever — start learning in seconds.
        </p>

        {serverError && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {serverError}
          </div>
        )}

        {needsConfirmation ? (
          <div className="mt-6 rounded-xl border border-[#0B2545]/20 bg-[#0B2545]/5 px-4 py-4 text-sm text-slate-700">
            <p className="font-semibold text-[#0B2545]">Check your inbox</p>
            <p className="mt-1">
              We sent a confirmation link to your email. Click it, then{" "}
              <Link href="/login" className="font-semibold text-[#0B2545] hover:underline">
                sign in
              </Link>
              .
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className={INPUT}
                {...register("email")}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="At least 8 characters"
                className={INPUT}
                {...register("password")}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50 ${NAVY}`}
            >
              {isSubmitting ? "Creating account…" : "Create account"}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-[#0B2545] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
