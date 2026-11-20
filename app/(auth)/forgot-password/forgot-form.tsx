"use client";

import Link from "next/link";
import { startTransition, useActionState } from "react";
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
import { requestResetAction, type ForgotState } from "@/features/auth/password-reset";

export default function ForgotForm() {
  const [state, formAction, pending] = useActionState<ForgotState, FormData>(
    requestResetAction,
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
      <h1 className={headingClass}>Forgot password?</h1>
      <p className="mt-2 text-sm text-indigo-800/80">
        Enter your email and we&apos;ll send you a link to choose a new one.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
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

        {state.status === "error" ? (
          <div role="alert" className={alertClass}>
            {state.message}
          </div>
        ) : null}
        {state.status === "done" ? (
          <div role="status" className={successClass}>
            {state.message}
          </div>
        ) : null}

        <SubmitButton pending={pending} label="Send reset link" pendingLabel="Sending..." />

        <p className="text-center text-sm text-indigo-800/80">
          <Link href="/login" className={linkClass}>
            Back to sign in
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}