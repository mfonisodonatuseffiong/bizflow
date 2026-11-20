"use client";

import { startTransition, useActionState } from "react";
import { PasswordInput } from "@/features/auth/password-input";
import {
  AuthCard,
  SubmitButton,
  alertClass,
  headingClass,
  labelClass,
} from "@/features/auth/auth-card";
import { resetPasswordAction, type ResetState } from "@/features/auth/password-reset";

export default function ResetForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState<ResetState, FormData>(
    resetPasswordAction,
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
      <h1 className={headingClass}>Choose a new password</h1>
      <p className="mt-2 text-sm text-indigo-800/80">
        You&apos;ll be signed out everywhere and asked to sign in again.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <input type="hidden" name="token" value={token} />

        <div>
          <label htmlFor="password" className={labelClass}>
            New password
          </label>
          <PasswordInput
            id="password"
            name="password"
            autoComplete="new-password"
            required
            minLength={8}
            maxLength={128}
            placeholder="At least 8 characters"
          />
        </div>

        <div>
          <label htmlFor="confirm" className={labelClass}>
            Confirm password
          </label>
          <PasswordInput
            id="confirm"
            name="confirm"
            autoComplete="new-password"
            required
            minLength={8}
            maxLength={128}
            placeholder="Repeat the password"
          />
        </div>

        {state.status === "error" ? (
          <div role="alert" className={alertClass}>
            {state.message}
          </div>
        ) : null}

        <SubmitButton pending={pending} label="Update password" pendingLabel="Updating..." />
      </form>
    </AuthCard>
  );
}