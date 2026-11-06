"use client";

import { startTransition, useActionState, useState } from "react";
import NG from "country-flag-icons/react/3x2/NG";
import GH from "country-flag-icons/react/3x2/GH";
import KE from "country-flag-icons/react/3x2/KE";
import ZA from "country-flag-icons/react/3x2/ZA";
import GB from "country-flag-icons/react/3x2/GB";
import US from "country-flag-icons/react/3x2/US";
import { businessTypes, countries } from "@/features/business/config";
import { onboardingAction, type OnboardingState } from "@/features/auth/onboarding";
import {
  btnShine,
  errorBox,
  inputClass,
  labelClass,
  primaryBtn,
} from "@/features/ui/glass";

const flags = { NG, GH, KE, ZA, GB, US };

const headingClass = [
  "bg-linear-to-r from-indigo-700 via-fuchsia-600 to-orange-500",
  "bg-clip-text text-2xl font-semibold tracking-tight text-transparent",
].join(" ");

export default function OnboardingForm({ name }: { name: string }) {
  const [countryCode, setCountryCode] = useState("NG");
  const [state, formAction, pending] = useActionState<OnboardingState, FormData>(
    onboardingAction,
    { status: "idle" },
  );
  const country = countries.find((c) => c.code === countryCode) ?? countries[0];
  const Flag = flags[country.code];

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    startTransition(() => formAction(data));
  }

  return (
    <div className="text-indigo-900">
      <h1 className={headingClass}>Welcome, {name}</h1>
      <p className="mt-2 text-sm text-indigo-800/80">
        One last step: tell us about your business. You&apos;ll be the owner.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label htmlFor="businessName" className={labelClass}>
            Business name
          </label>
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
          <label htmlFor="businessType" className={labelClass}>
            Business type
          </label>
          <select
            id="businessType"
            name="businessType"
            required
            defaultValue=""
            className={inputClass}
          >
            <option value="" disabled>
              Select your business type
            </option>
            <optgroup label="Retail">
              {businessTypes
                .filter((t) => t.category === "RETAIL")
                .map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
            </optgroup>
            <optgroup label="Service">
              {businessTypes
                .filter((t) => t.category === "SERVICE")
                .map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
            </optgroup>
          </select>
        </div>

        <div>
          <label htmlFor="country" className={labelClass}>
            Country
          </label>
          <div className="flex items-center gap-3">
            <span className="inline-block h-6 w-9 shrink-0 overflow-hidden rounded-[3px] shadow-sm ring-1 ring-black/10 [&>svg]:block [&>svg]:h-full [&>svg]:w-full">
              <Flag title={country.name} />
            </span>
            <select
              id="country"
              name="country"
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className={`${inputClass} flex-1`}
            >
              {countries.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <p className="mt-1.5 text-xs font-medium text-indigo-800/70">
            Currency: {country.currency} · Timezone: {country.timezone}
          </p>
        </div>

        {state.status === "error" ? (
          <div role="alert" className={errorBox}>
            {state.message}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className={`${primaryBtn} w-full px-4 py-3`}
        >
          <span className={btnShine} />
          <span className="relative">
            {pending ? "Setting up..." : "Finish setup"}
          </span>
        </button>
      </form>
    </div>
  );
}