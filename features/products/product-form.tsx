"use client";

import { startTransition, useActionState, useEffect, useRef } from "react";
import { createProductAction, type ProductFormState } from "@/features/products/actions";

const inputClass =
  "block w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20";

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
    const data = new FormData(event.currentTarget);
    startTransition(() => formAction(data));
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <h2 className="text-sm font-semibold text-slate-900">Add a product</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-slate-700">Name</label>
          <input id="name" name="name" required minLength={2} placeholder="e.g. Indomie Chicken 70g" className={inputClass} />
        </div>
        <div>
          <label htmlFor="sku" className="mb-1.5 block text-sm font-medium text-slate-700">SKU (optional)</label>
          <input id="sku" name="sku" placeholder="e.g. NOOD-070" className={inputClass} />
        </div>
        <div>
          <label htmlFor="price" className="mb-1.5 block text-sm font-medium text-slate-700">Price ({currency})</label>
          <input id="price" name="price" required inputMode="decimal" placeholder="12.50" className={inputClass} />
        </div>
      </div>

      {state.status === "error" ? (
        <div role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {state.message}
        </div>
      ) : null}
      {state.status === "success" ? (
        <div role="status" className="mt-4 rounded-xl border border-brand-100 bg-brand-50 px-4 py-3 text-sm text-brand-700">
          {state.message}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-4 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition hover:bg-brand-700 disabled:opacity-60"
      >
        {pending ? "Adding..." : "Add product"}
      </button>
    </form>
  );
}
