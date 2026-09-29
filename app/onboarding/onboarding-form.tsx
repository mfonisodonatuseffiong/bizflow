"use client";

import { startTransition, useActionState, useState } from "react";
import { businessTypes, countries } from "@/features/business/config";
import { onboardingAction, type OnboardingState } from "@/features/auth/onboarding";

const inputClass =
  "block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20";
const labelClass = "mb-1.5 block text-sm font-medium text-slate-700";

export default function OnboardingForm({ name }: { name: string }) {
  const [countryCode, setCountryCode] = useState("NG");
  const [state, formAction, pending] = useActionState<OnboardingState, FormData>(
    onboardingAction,
    { status: "idle" },
  );
  const country = countries.find((c) => c.code === countryCode) ?? countries[0];

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    startTransition(() => formAction(data));
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
        Welcome, {name}
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        One last step: tell us about your business. You&apos;ll be the owner.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label htmlFor="businessName" className={labelClass}>Business name</label>
          <input
            id="businessName"
            name="businessName"
            type="text"
            autoComplete="organization"
            required
            minLength={2}
            placeholder="e.g. Mfoniso Supermarket"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="businessType" className={labelClass}>Business type</label>
          <select id="businessType" name="businessType" required defaultValue="" className={inputClass}>
            <option value="" disabled>Select your business type</option>
            <optgroup label="Retail">
              {businessTypes.filter((t) => t.category === "RETAIL").map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </optgroup>
            <optgroup label="Service">
              {businessTypes.filter((t) => t.category === "SERVICE").map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </optgroup>
          </select>
        </div>

        <div>
          <label htmlFor="country" className={labelClass}>Country</label>
          <select
            id="country"
            name="country"
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            className={inputClass}
          >
            {countries.map((c) => (
              <option key={c.code} value={c.code}>{c.name}</option>
            ))}
          </select>
          <p className="mt-1.5 text-xs text-slate-500">
            Currency: {country.currency} · Timezone: {country.timezone}
          </p>
        </div>

        {state.status === "error" ? (
          <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {state.message}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/40 focus:ring-offset-2 disabled:opacity-60"
        >
          {pending ? "Setting up..." : "Finish setup"}
        </button>
      </form>
    </div>
  );
}
