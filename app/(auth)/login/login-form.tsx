"use client";

import Link from "next/link";
import { GoogleButton } from "@/features/auth/google-button";
import { startTransition, useActionState } from "react";
import { loginAction, type LoginState } from "@/features/auth/login";
import { PasswordInput } from "@/features/auth/password-input";
import {
  AuthCard,
  SubmitButton,
  alertClass,
  headingClass,
  inputClass,
  labelClass,
  linkClass,
  successClass,
} from "@/features/auth/auth-card";

export default function LoginForm({
  notice,
  info,
}: {
  notice?: string;
  info?: string;
}) {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    loginAction,
    { status: "idle" },
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const data = new FormData(event.currentTarget);
    startTransition(() => formAction(data));
  }

  return (
    <AuthCard>
      <h1 className={headingClass}>Welcome back</h1>
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
          <div className="flex items-baseline justify-between">
            <label htmlFor="password" className={labelClass}>
              Password
            </label>
            <Link href="/forgot-password" className={`${linkClass} mb-1.5 text-xs`}>
              Forgot password?
            </Link>
          </div>
          <PasswordInput
            id="password"
            name="password"
            autoComplete="current-password"
            required
            placeholder="Your password"
          />
        </div>

        {info && state.status !== "error" ? (
          <div role="status" className={successClass}>
            {info}
          </div>
        ) : null}

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

        <SubmitButton pending={pending} label="Sign in" pendingLabel="Signing in..." />

        <p className="text-center text-sm text-indigo-800/80">
          New to BizFlow?{" "}
          <Link href="/register" className={linkClass}>
            Create an account
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}