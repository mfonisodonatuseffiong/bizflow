"use client";

import { useState } from "react";
import { inputClass } from "@/features/auth/auth-card";

export function PasswordInput(
  props: Omit<React.ComponentProps<"input">, "type" | "className">,
) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        {...props}
        type={visible ? "text" : "password"}
        className={`${inputClass} pr-11`}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        className="absolute inset-y-0 right-0 flex items-center px-3 text-indigo-800/60 transition hover:text-indigo-900 focus:outline-none focus-visible:text-fuchsia-700"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.7}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {visible ? (
            <>
              <path d="M3 3l18 18" />
              <path d="M10.6 6.1A9.8 9.8 0 0112 6c5 0 8.5 4.5 9.5 6a15 15 0 01-3.2 3.7M6.6 6.7C4.4 8.1 2.9 10.3 2.5 12c1 1.5 4.5 6 9.5 6 1.5 0 2.8-.4 4-1" />
              <path d="M9.9 9.9a3 3 0 004.2 4.2" />
            </>
          ) : (
            <>
              <path d="M2.5 12C3.5 10.5 7 6 12 6s8.5 4.5 9.5 6c-1 1.5-4.5 6-9.5 6s-8.5-4.5-9.5-6z" />
              <circle cx="12" cy="12" r="3" />
            </>
          )}
        </svg>
      </button>
    </div>
  );
}