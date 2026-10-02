"use client";

import Link from "next/link";
import { GoogleButton } from "@/features/auth/google-button";
import { startTransition, useActionState } from "react";
import { loginAction, type LoginState } from "@/features/auth/login";

const cardClass =
  "relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-card p-6 shadow-2xl shadow-black/40 ring-1 ring-accent-500/20 sm:p-8";

const inputClass =
  "block w-full rounded-xl border border-white/15 bg-brand-700/60 px-3.5 py-2.5 text-base text-white shadow-sm placeholder:text-slate-500 transition focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/40 sm:text-sm";

const labelClass = "mb-1.5 block text-sm font-medium text-slate-200";

const alertClass =
  "rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200";

export default function LoginForm({ notice }: { notice?: string }) {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    loginAction,
    { status: "idle" },
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    startTransition(() => formAction(data));
  }

  return (
    <div className={cardClass}>
      {/* Deep coral-to-orange accent line across the top */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-linear-to-r from-accent-600 via-accent-500 to-orange-400"
      />
      {/* Coral glow in the corner */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-accent-500/30 blur-3xl"
      />

      <div className="relative">
        {/* Same gradient as the homepage tagline */}
        <h1 className="bg-linear-to-r from-white via-accent-500 to-orange-300 bg-clip-text text-3xl font-semibold tracking-tight text-transparent">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-slate-300">
          Sign in to your BizFlow workspace.
        </p>

        <div className="mt-6 sm:mt-8">
          <GoogleButton label="Continue with Google" />
          <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-wider text-slate-400 sm:my-6">
            <span className="h-px flex-1 bg-linear-to-r from-transparent to-accent-500/40" />
            or
            <span className="h-px flex-1 bg-linear-to-l from-transparent to-accent-500/40" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className={labelClass}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="password" className={labelClass}>
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="Your password"
              className={inputClass}
            />
          </div>

          {notice && state.status !== "error" ? (
            <div role="alert" className={alertClass}>
              {notice}
            </div>
          ) : null}

          {state.status === "error" ? (
            <div role="alert" className={alertClass}>
              {state.message}
            </div>
          ) : null}

          {/* Same button as the homepage: deep coral with a double glow */}
          <button
            type="submit"
            disabled={pending}
            className="group relative w-full overflow-hidden rounded-xl border border-accent-500/60 bg-accent-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_0_30px_rgba(231,76,60,0.55),0_0_80px_rgba(231,76,60,0.25)] transition duration-300 hover:bg-accent-600 hover:shadow-[0_0_40px_rgba(231,76,60,0.7),0_0_100px_rgba(231,76,60,0.35)] focus:outline-none focus:ring-2 focus:ring-accent-500/60 focus:ring-offset-2 focus:ring-offset-card disabled:opacity-60"
          >
            <span className="pointer-events-none absolute inset-x-3 top-0 h-1/2 rounded-b-full bg-linear-to-b from-white/30 to-transparent" />
            <span className="relative">
              {pending ? "Signing in..." : "Sign in"}
            </span>
          </button>

          <p className="text-center text-sm text-slate-300">
            New to BizFlow?{" "}
            <Link
              href="/register"
              className="font-semibold text-accent-500 transition hover:text-orange-300"
            >
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}