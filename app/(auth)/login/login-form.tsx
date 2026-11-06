"use client";

import Link from "next/link";
import { GoogleButton } from "@/features/auth/google-button";
import { startTransition, useActionState } from "react";
import { loginAction, type LoginState } from "@/features/auth/login";

/* Light glass card, same look as the landing page */
const cardClass =
  "relative w-full max-w-md overflow-hidden rounded-3xl border border-white/70 bg-white/45 p-6 shadow-[0_20px_60px_rgba(124,58,237,0.25),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-2xl sm:p-8";

const inputClass =
  "block w-full rounded-xl border border-white/80 bg-white/60 px-3.5 py-2.5 text-base text-indigo-900 shadow-sm placeholder:text-indigo-800/40 transition focus:border-fuchsia-500 focus:bg-white/80 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/30 sm:text-sm";

const labelClass = "mb-1.5 block text-sm font-semibold text-indigo-900";

const alertClass =
  "rounded-lg border border-red-300 bg-red-100/80 px-4 py-3 text-sm font-medium text-red-700";

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
      {/* Orange-to-fuchsia-to-indigo accent line across the top */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-linear-to-r from-orange-400 via-fuchsia-500 to-indigo-500"
      />
      {/* Fuchsia glow in the corner */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-fuchsia-400/40 blur-3xl"
      />

      <div className="relative">
        {/* Same gradient as the homepage headline */}
        <h1 className="bg-linear-to-r from-indigo-700 via-fuchsia-600 to-indigo-700 bg-clip-text text-3xl font-semibold tracking-tight text-transparent">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-indigo-800/80">
          Sign in to your BizFlow workspace.
        </p>

        <div className="mt-6 sm:mt-8">
          <GoogleButton label="Continue with Google" />
          <div className="my-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-indigo-800/60 sm:my-6">
            <span className="h-px flex-1 bg-linear-to-r from-transparent to-fuchsia-500/50" />
            or
            <span className="h-px flex-1 bg-linear-to-l from-transparent to-fuchsia-500/50" />
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

          {/* Same button as the homepage: indigo to fuchsia with a glow */}
          <button
            type="submit"
            disabled={pending}
            className="group relative w-full overflow-hidden rounded-xl bg-linear-to-r from-indigo-600 via-violet-600 to-fuchsia-600 px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(109,40,217,0.45)] ring-1 ring-white/40 transition duration-300 hover:scale-[1.02] hover:shadow-[0_10px_45px_rgba(109,40,217,0.65)] focus:outline-none focus:ring-2 focus:ring-fuchsia-500/60 focus:ring-offset-2 focus:ring-offset-pink-100 disabled:opacity-60 disabled:hover:scale-100"
          >
            <span className="pointer-events-none absolute inset-x-3 top-0 h-1/2 rounded-b-full bg-linear-to-b from-white/35 to-transparent" />
            <span className="relative">
              {pending ? "Signing in..." : "Sign in"}
            </span>
          </button>

          <p className="text-center text-sm text-indigo-800/80">
            New to BizFlow?{" "}
            <Link
              href="/register"
              className="font-semibold text-fuchsia-700 transition hover:text-indigo-700"
            >
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}