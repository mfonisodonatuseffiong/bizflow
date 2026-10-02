"use client";

import { startTransition, useActionState, useEffect, useRef } from "react";
import { createProductAction, type ProductFormState } from "@/features/products/actions";

const inputClass =
  "block w-full rounded-xl border border-white/15 bg-brand-700/60 px-3.5 py-2.5 text-base text-white shadow-sm placeholder:text-slate-500 transition focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/40 sm:text-sm";

const labelClass = "mb-1.5 block text-sm font-medium text-slate-200";

export function ProductForm({ currency }: { currency: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState<ProductFormState, FormData>(
    createProductAction,
    { status: "idle" },
  );

  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return; // ignore clicks while a save is in flight
    const data = new FormData(event.currentTarget);
    startTransition(() => formAction(data));
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-card p-5 shadow-xl shadow-black/30 ring-1 ring-accent-500/10 sm:p-6"
    >
      {/* Coral-to-orange line across the top */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-linear-to-r from-accent-600 via-accent-500 to-orange-400"
      />
      {/* Coral glow in the corner */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-accent-500/20 blur-3xl"
      />

      <div className="relative">
        <h2 className="text-base font-semibold text-white">Add a product</h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label htmlFor="name" className={labelClass}>
              Name
            </label>
            <input
              id="name"
              name="name"
              required
              minLength={2}
              placeholder="e.g. Indomie Chicken 70g"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="sku" className={labelClass}>
              SKU (optional)
            </label>
            <input
              id="sku"
              name="sku"
              placeholder="e.g. NOOD-070"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="price" className={labelClass}>
              Price ({currency})
            </label>
            <input
              id="price"
              name="price"
              required
              inputMode="decimal"
              placeholder="12.50"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="openingStock" className={labelClass}>
              Opening stock (optional)
            </label>
            <input
              id="openingStock"
              name="openingStock"
              inputMode="numeric"
              placeholder="e.g. 24"
              className={inputClass}
            />
          </div>
        </div>

        {state.status === "error" ? (
          <div
            role="alert"
            className="mt-4 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
          >
            {state.message}
          </div>
        ) : null}
        {state.status === "success" ? (
          <div
            role="status"
            className="mt-4 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200"
          >
            {state.message}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="group relative mt-4 w-full overflow-hidden rounded-xl border border-accent-500/60 bg-accent-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_24px_rgba(231,76,60,0.45)] transition duration-300 hover:bg-accent-600 hover:shadow-[0_0_34px_rgba(231,76,60,0.65)] focus:outline-none focus:ring-2 focus:ring-accent-500/60 focus:ring-offset-2 focus:ring-offset-card disabled:opacity-60 sm:w-auto"
        >
          <span className="pointer-events-none absolute inset-x-3 top-0 h-1/2 rounded-b-full bg-linear-to-b from-white/30 to-transparent" />
          <span className="relative">{pending ? "Adding..." : "Add product"}</span>
        </button>
      </div>
    </form>
  );
}