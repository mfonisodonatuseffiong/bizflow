"use client";

import Link from "next/link";
import { GoogleButton } from "@/features/auth/google-button";
import { startTransition, useActionState, useState } from "react";
import NG from "country-flag-icons/react/3x2/NG";
import GH from "country-flag-icons/react/3x2/GH";
import KE from "country-flag-icons/react/3x2/KE";
import ZA from "country-flag-icons/react/3x2/ZA";
import GB from "country-flag-icons/react/3x2/GB";
import US from "country-flag-icons/react/3x2/US";
import { registerAction, type RegisterState } from "@/features/auth/actions";
import { businessTypes, countries } from "@/features/business/config";
import {
  AuthCard,
  SubmitButton,
  alertClass,
  headingClass,
  inputClass,
  labelClass,
  linkClass,
} from "@/features/auth/auth-card";

const flags = { NG, GH, KE, ZA, GB, US };

const infoClass =
  "rounded-lg border border-indigo-300 bg-indigo-100/70 px-4 py-3 text-sm text-indigo-800";

export default function RegisterForm({
  invite,
}: {
  invite: { email: string; businessName: string } | null;
}) {
  const invited = invite !== null;
  const [countryCode, setCountryCode] = useState("");
  const [state, formAction, pending] = useActionState<RegisterState, FormData>(
    registerAction,
    { status: "idle" },
  );

  const country = countries.find((c) => c.code === countryCode);
  const Flag = country ? flags[country.code] : undefined;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const data = new FormData(event.currentTarget);
    startTransition(() => formAction(data));
  }

  return (
    <AuthCard>
      <h1 className={headingClass}>Create your account</h1>
      <p className="mt-2 text-sm text-indigo-800/80">
        Start managing your business with BizFlow.
      </p>

      {invite ? (
        <div className={`${infoClass} mt-4`}>
          You were invited to join <b>{invite.businessName}</b>. Create your
          account with <b>{invite.email}</b> to accept.
        </div>
      ) : null}

      <div className="mt-6 sm:mt-8">
        <GoogleButton label="Sign up with Google" />
        <div className="my-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-indigo-800/60 sm:my-6">
          <span className="h-px flex-1 bg-linear-to-r from-transparent to-fuchsia-500/50" />
          or
          <span className="h-px flex-1 bg-linear-to-l from-transparent to-fuchsia-500/50" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className={labelClass}>
            Full name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            minLength={2}
            placeholder="Your full name"
            className={inputClass}
          />
        </div>

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
            defaultValue={invite?.email ?? ""}
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
            autoComplete="new-password"
            required
            minLength={8}
            maxLength={128}
            placeholder="At least 8 characters"
            className={inputClass}
          />
        </div>

        {invite ? (
          <p className="text-xs text-indigo-800/70">
            Business details below are optional. Leave them empty to join{" "}
            {invite.businessName} without creating a business of your own.
          </p>
        ) : null}

        <div>
          <label htmlFor="businessName" className={labelClass}>
            Business name{invited ? " (optional)" : ""}
          </label>
          <input
            id="businessName"
            name="businessName"
            type="text"
            autoComplete="organization"
            required={!invited}
            minLength={invited ? undefined : 2}
            placeholder="Your business name"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="businessType" className={labelClass}>
            Business type
          </label>
          <select
            id="businessType"
            name="businessType"
            required={!invited}
            defaultValue=""
            className={inputClass}
          >
            <option value="" disabled={!invited} className="text-indigo-900">
              Select a business type
            </option>
            {businessTypes.map((t) => (
              <option key={t.value} value={t.value} className="text-indigo-900">
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="country" className={labelClass}>
            Country
          </label>
          <div className="flex items-center gap-3">
            <span
              aria-hidden={!Flag}
              className={`inline-block h-6 w-9 shrink-0 overflow-hidden rounded-[3px] [&>svg]:block [&>svg]:h-full [&>svg]:w-full ${
                Flag
                  ? "shadow-sm ring-1 ring-black/10"
                  : "bg-white/50 ring-1 ring-white/80"
              }`}
            >
              {Flag ? <Flag title={country?.name} /> : null}
            </span>
            <select
              id="country"
              name="country"
              required={!invited}
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className={`${inputClass} flex-1`}
            >
              <option value="" disabled={!invited} className="text-indigo-900">
                Select a country
              </option>
              {countries.map((c) => (
                <option key={c.code} value={c.code} className="text-indigo-900">
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {state.status === "error" ? (
          <div role="alert" className={alertClass}>
            {state.message}
          </div>
        ) : null}

        <SubmitButton
          pending={pending}
          label="Create account"
          pendingLabel="Creating account..."
        />

        <p className="text-center text-sm text-indigo-800/80">
          Already have an account?{" "}
          <Link href="/login" className={linkClass}>
            Sign in
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}