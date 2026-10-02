"use client";

import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { createSaleAction, type SaleFormState } from "@/features/sales/actions";

type P = { id: string; name: string; priceMinor: number; stock: number };
type C = { id: string; name: string };
type Line = { key: number; productId: string; quantity: string };

const inputClass =
  "block w-full rounded-xl border border-white/15 bg-brand-700/60 px-3.5 py-2.5 text-base text-white placeholder:text-slate-500 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/40 sm:text-sm";
const labelClass = "mb-1.5 block text-sm font-medium text-slate-200";

export function SaleForm({
  products,
  customers,
  currency,
}: {
  products: P[];
  customers: C[];
  currency: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const nextKey = useRef(2);
  const [lines, setLines] = useState<Line[]>([{ key: 1, productId: "", quantity: "1" }]);
  const [state, formAction, pending] = useActionState<SaleFormState, FormData>(
    createSaleAction,
    { status: "idle" },
  );

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
      setLines([{ key: nextKey.current++, productId: "", quantity: "1" }]);
    }
  }, [state]);

  const byId = new Map(products.map((p) => [p.id, p]));
  const total = lines.reduce((sum, l) => {
    const p = byId.get(l.productId);
    const q = Number(l.quantity);
    return p && Number.isInteger(q) && q > 0 ? sum + p.priceMinor * q : sum;
  }, 0);
  const money = (minor: number) =>
    new Intl.NumberFormat("en", { style: "currency", currency }).format(minor / 100);

  function update(key: number, patch: Partial<Line>) {
    setLines((ls) => ls.map((l) => (l.key === key ? { ...l, ...patch } : l)));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const data = new FormData(event.currentTarget);
    data.set(
      "cart",
      JSON.stringify(
        lines
          .filter((l) => l.productId)
          .map((l) => ({ productId: l.productId, quantity: Number(l.quantity) })),
      ),
    );
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
      <h2 className="text-base font-semibold text-white">New sale</h2>

      <div className="mt-4 space-y-3">
        {lines.map((l) => {
          const p = byId.get(l.productId);
          return (
            <div key={l.key} className="grid grid-cols-[1fr_5rem_auto] items-center gap-3 sm:grid-cols-[1fr_6rem_8rem_auto]">
              <select
                value={l.productId}
                onChange={(e) => update(l.key, { productId: e.target.value })}
                className={inputClass}
                aria-label="Product"
              >
                <option value="" className="text-black">Select a product</option>
                {products.map((x) => (
                  <option key={x.id} value={x.id} disabled={x.stock <= 0} className="text-black">
                    {x.name} ({x.stock} in stock)
                  </option>
                ))}
              </select>
              <input
                value={l.quantity}
                onChange={(e) => update(l.key, { quantity: e.target.value })}
                inputMode="numeric"
                className={inputClass}
                aria-label="Quantity"
              />
              <span className="hidden text-right text-sm font-semibold text-white sm:block">
                {p ? money(p.priceMinor * (Number(l.quantity) || 0)) : "-"}
              </span>
              <button
                type="button"
                onClick={() =>
                  setLines((ls) => (ls.length > 1 ? ls.filter((x) => x.key !== l.key) : ls))
                }
                className="rounded-lg border border-white/15 px-3 py-2 text-xs text-slate-200 hover:bg-white/5"
              >
                Remove
              </button>
            </div>
          );
        })}
        <button
          type="button"
          onClick={() =>
            setLines((ls) => [...ls, { key: nextKey.current++, productId: "", quantity: "1" }])
          }
          className="rounded-lg border border-white/15 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/5"
        >
          + Add another product
        </button>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="customerId" className={labelClass}>Customer (optional)</label>
          <select id="customerId" name="customerId" defaultValue="" className={inputClass}>
            <option value="" className="text-black">Walk-in customer</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id} className="text-black">{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="paid" className={labelClass}>Amount paid ({currency})</label>
          <input
            id="paid"
            name="paid"
            inputMode="decimal"
            placeholder="Blank = paid in full"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="method" className={labelClass}>Payment method</label>
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

      <div className="mt-5 flex items-center justify-between gap-4">
        <p className="text-lg font-semibold text-white">Total: {money(total)}</p>
        <button
          type="submit"
          disabled={pending}
          className="rounded-xl border border-accent-500/60 bg-accent-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-600 disabled:opacity-60"
        >
          {pending ? "Saving..." : "Record sale"}
        </button>
      </div>
    </form>
  );
}
