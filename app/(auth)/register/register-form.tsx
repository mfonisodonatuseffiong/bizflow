"use client";

import Link from "next/link";
import { useState } from "react";
import { businessTypes, countries } from "@/features/business/config";

const inputClass =
  "block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20";

function passwordScore(password: string) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password) && /[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

const strengthLabels = ["", "Weak", "Good", "Strong"];
const strengthColors = ["", "bg-red-500", "bg-amber-500", "bg-emerald-500"];

function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-sm font-medium text-slate-700"
      >
        {label}
      </label>
      {children}
      {hint ? <p className="mt-1.5 text-xs text-slate-500">{hint}</p> : null}
    </div>
  );
}

export default function RegisterForm() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [countryCode, setCountryCode] = useState("NG");
  const [submitted, setSubmitted] = useState(false);

  const country = countries.find((c) => c.code === countryCode) ?? countries[0];
  const score = password.length === 0 ? 0 : Math.max(passwordScore(password), 1);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
        Create your account
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Set up your business in a couple of minutes. You&apos;ll be the owner.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <Field label="Full name" htmlFor="name">
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
        </Field>

        <Field label="Email" htmlFor="email">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            className={inputClass}
          />
        </Field>

        <Field label="Password" htmlFor="password">
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className={`${inputClass} pr-16`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-0 px-3.5 text-xs font-medium text-slate-500 hover:text-slate-800"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <div className="mt-2 flex items-center gap-3" aria-live="polite">
            <div className="flex flex-1 gap-1.5">
              {[1, 2, 3].map((segment) => (
                <span
                  key={segment}
                  className={`h-1.5 flex-1 rounded-full ${
                    segment <= score ? strengthColors[score] : "bg-slate-200"
                  }`}
                />
              ))}
            </div>
            <span className="w-12 text-right text-xs text-slate-500">
              {strengthLabels[score]}
            </span>
          </div>
        </Field>

        <hr className="border-slate-200" />

        <Field label="Business name" htmlFor="businessName">
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
        </Field>

        <Field label="Business type" htmlFor="businessType">
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
        </Field>

        <Field
          label="Country"
          htmlFor="country"
          hint={`Currency: ${country.currency} · Timezone: ${country.timezone}`}
        >
          <select
            id="country"
            name="country"
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            className={inputClass}
          >
            {countries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>

        {submitted ? (
          <div
            role="status"
            className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
          >
            The form looks good. Saving your account gets connected in the next
            step.
          </div>
        ) : null}

        <button
          type="submit"
          className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/40 focus:ring-offset-2"
        >
          Create account
        </button>

        <p className="text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-emerald-700 hover:text-emerald-800"
          >
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}