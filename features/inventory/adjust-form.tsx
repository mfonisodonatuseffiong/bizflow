"use client";

import { startTransition, useActionState, useEffect, useRef } from "react";
import { adjustStockAction, type StockFormState } from "@/features/inventory/actions";

const inputClass =
  "block w-full rounded-xl border border-white/15 bg-brand-700/60 px-3.5 py-2.5 text-base text-white placeholder:text-slate-500 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/40 sm:text-sm";
const labelClass = "mb-1.5 block text-sm font-medium text-slate-200";

export function AdjustForm({ products }: { products: { id: string; name: string }[] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState<StockFormState, FormData>(
    adjustStockAction,
    { status: "idle" },
  );

  // Clear the fields only after a successful save, never on an error.
  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const data = new FormData(event.currentTarget);
    startTransition(() => formAction(data));
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="grid gap-4 rounded-2xl border border-white/10 bg-card p-5 sm:grid-cols-2"
    >
      <div className="sm:col-span-2">
        <label htmlFor="productId" className={labelClass}>Product</label>
        <select id="productId" name="productId" required defaultValue="" className={inputClass}>
          <option value="" disabled className="text-black">Select a product</option>
          {products.map((p) => (
            <option key={p.id} value={p.id} className="text-black">{p.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="kind" className={labelClass}>Change type</label>
        <select id="kind" name="kind" required defaultValue="RESTOCK" className={inputClass}>
          <option value="RESTOCK" className="text-black">Restock (add)</option>
          <option value="ADJUSTMENT" className="text-black">Adjustment (+/-)</option>
        </select>
      </div>

      <div>
        <label htmlFor="quantity" className={labelClass}>Quantity</label>
        <input
          id="quantity" name="quantity" type="number" step={1} required
          placeholder="e.g. 24 or -3" className={inputClass}
        />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="note" className={labelClass}>Note (optional)</label>
        <input
          id="note" name="note" type="text" maxLength={200}
          placeholder="e.g. Supplier delivery, damaged items" className={inputClass}
        />
      </div>

      {state.status === "error" && (
        <div role="alert" className="rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200 sm:col-span-2">
          {state.message}
        </div>
      )}
      {state.status === "success" && (
        <div role="status" className="rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200 sm:col-span-2">
          {state.message}
        </div>
      )}

      <button
        type="submit" disabled={pending}
        className="rounded-xl border border-accent-500/60 bg-accent-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-accent-600 disabled:opacity-60 sm:col-span-2"
      >
        {pending ? "Saving..." : "Update stock"}
      </button>
    </form>
  );
}