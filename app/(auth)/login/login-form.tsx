"use client";

import Link from "next/link";
import { GoogleButton } from "@/features/auth/google-button";
import { startTransition, useActionState } from "react";
import { loginAction, type LoginState } from "@/features/auth/login";

const inputClass =
  "block w-full rounded-xl border border-slate-200 bg-white/80 px-3.5 py-2.5 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20";

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
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
        Welcome back
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Sign in to your BizFlow workspace.
      </p>

      <div className="mt-8">
        <GoogleButton label="Continue with Google" />
        <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wider text-slate-400">
          <span className="h-px flex-1 bg-slate-200" />
          or
          <span className="h-px flex-1 bg-slate-200" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
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
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-700">
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
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            {notice}
          </div>
        ) : null}

        {state.status === "error" ? (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            {state.message}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-600/40 focus:ring-offset-2 disabled:opacity-60"
        >
          {pending ? "Signing in..." : "Sign in"}
        </button>

        <p className="text-center text-sm text-slate-600">
          New to BizFlow?{" "}
          <Link href="/register" className="font-medium text-brand-700 hover:text-brand-600">
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
}
