"use client";

import { startTransition, useActionState, useEffect, useRef } from "react";
import { recordPaymentAction, type PaymentFormState } from "@/features/payments/actions";

type Option = { id: string; label: string };

const inputClass =
  "block w-full rounded-xl border border-white/15 bg-brand-700/60 px-3.5 py-2.5 text-base text-white placeholder:text-slate-500 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/40 sm:text-sm";
const labelClass = "mb-1.5 block text-sm font-medium text-slate-200";

export function PaymentForm({ options, currency }: { options: Option[]; currency: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState<PaymentFormState, FormData>(
    recordPaymentAction,
    { status: "idle" },
  );

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
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-card p-5 shadow-xl shadow-black/30 ring-1 ring-accent-500/10 sm:p-6"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-linear-to-r from-accent-600 via-accent-500 to-orange-400"
      />
      <h2 className="text-base font-semibold text-white">Record a payment</h2>

      {options.length === 0 ? (
        <p className="mt-3 text-sm text-slate-300">No sales are waiting for payment.</p>
      ) : (
        <>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="saleId" className={labelClass}>Sale</label>
              <select id="saleId" name="saleId" required defaultValue="" className={inputClass}>
                <option value="" disabled className="text-black">Select a sale</option>
                {options.map((o) => (
                  <option key={o.id} value={o.id} className="text-black">{o.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="amount" className={labelClass}>Amount ({currency})</label>
              <input
                id="amount"
                name="amount"
                inputMode="decimal"
                placeholder="Blank = full balance"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="method" className={labelClass}>Method</label>
              <select id="method" name="method" defaultValue="CASH" className={inputClass}>
                <option value="CASH" className="text-black">Cash</option>
                <option value="TRANSFER" className="text-black">Bank transfer</option>
                <option value="MOBILE_MONEY" className="text-black">Mobile money</option>
              </select>
            </div>
          </div>

          {state.status === "error" && (
            <div role="alert" className="mt-4 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {state.message}
            </div>
          )}
          {state.status === "success" && (
            <div role="status" className="mt-4 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
              {state.message}
            </div>
          )}

          <button
            type="submit"
            disabled={pending}
            className="mt-4 w-full rounded-xl border border-accent-500/60 bg-accent-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-600 disabled:opacity-60 sm:w-auto"
          >
            {pending ? "Saving..." : "Record payment"}
          </button>
        </>
      )}
    </form>
  );
}