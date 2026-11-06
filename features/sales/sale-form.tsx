"use client";

import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { createSaleAction, type SaleFormState } from "@/features/sales/actions";
import {
  btnShine,
  cornerGlow,
  errorBox,
  formCard,
  inputClass,
  labelClass,
  okBox,
  primaryBtn,
  smallBtn,
  topLine,
} from "@/features/ui/glass";

type P = { id: string; name: string; priceMinor: number; stock: number };
type C = { id: string; name: string };
type Line = { key: number; productId: string; quantity: string };

// crypto.randomUUID() only exists in secure contexts (https / localhost),
// so fall back to getRandomValues, which works everywhere.
function newRequestId(): string {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const b = crypto.getRandomValues(new Uint8Array(16));
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = Array.from(b, (x) => x.toString(16).padStart(2, "0"));
  return `${h.slice(0, 4).join("")}-${h.slice(4, 6).join("")}-${h
    .slice(6, 8)
    .join("")}-${h.slice(8, 10).join("")}-${h.slice(10).join("")}`;
}

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
  // Blocks a second submit in the same instant, before `pending` re-renders.
  const submitting = useRef(false);
  // Idempotency key for the sale being submitted. Created on first submit,
  // reused on retries, cleared only after the sale is confirmed.
  const requestId = useRef<string | null>(null);
  const [lines, setLines] = useState<Line[]>([{ key: 1, productId: "", quantity: "1" }]);
  const [state, formAction, pending] = useActionState<SaleFormState, FormData>(
    createSaleAction,
    { status: "idle" },
  );

  useEffect(() => {
    // A result came back (success or error), so allow the next submit.
    submitting.current = false;
    if (state.status === "success") {
      requestId.current = null; // next sale gets a fresh key
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
    if (pending || submitting.current) return;
    submitting.current = true;

    if (!requestId.current) requestId.current = newRequestId();

    const data = new FormData(event.currentTarget);
    data.set("requestId", requestId.current);
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
    <form ref={formRef} onSubmit={handleSubmit} className={formCard}>
      <span aria-hidden="true" className={topLine} />
      <span aria-hidden="true" className={cornerGlow} />

      <div className="relative">
        <h2 className="text-base font-semibold text-indigo-900">New sale</h2>

        <div className="mt-4 space-y-3">
          {lines.map((l) => {
            const p = byId.get(l.productId);
            return (
              <div
                key={l.key}
                className="grid grid-cols-[1fr_5rem_auto] items-center gap-3 sm:grid-cols-[1fr_6rem_8rem_auto]"
              >
                <select
                  value={l.productId}
                  onChange={(e) => update(l.key, { productId: e.target.value })}
                  className={inputClass}
                  aria-label="Product"
                >
                  <option value="" className="text-indigo-900">
                    Select a product
                  </option>
                  {products.map((x) => (
                    <option
                      key={x.id}
                      value={x.id}
                      disabled={x.stock <= 0}
                      className="text-indigo-900"
                    >
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
                <span className="hidden text-right text-sm font-semibold text-indigo-900 sm:block">
                  {p ? money(p.priceMinor * (Number(l.quantity) || 0)) : "-"}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setLines((ls) => (ls.length > 1 ? ls.filter((x) => x.key !== l.key) : ls))
                  }
                  className={smallBtn}
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
            className={smallBtn}
          >
            + Add another product
          </button>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="customerId" className={labelClass}>
              Customer (optional)
            </label>
            <select
              id="customerId"
              name="customerId"
              defaultValue=""
              className={inputClass}
            >
              <option value="" className="text-indigo-900">Walk-in customer</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id} className="text-indigo-900">
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="paid" className={labelClass}>
              Amount paid ({currency})
            </label>
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
            <select
              id="method"
              name="method"
              defaultValue="CASH"
              className={inputClass}
            >
              <option value="CASH" className="text-indigo-900">Cash</option>
              <option value="TRANSFER" className="text-indigo-900">Bank transfer</option>
              <option value="MOBILE_MONEY" className="text-indigo-900">
                Mobile money
              </option>
            </select>
          </div>
        </div>

        {state.status === "error" && (
          <div role="alert" className={`${errorBox} mt-4`}>
            {state.message}
          </div>
        )}
        {state.status === "success" && (
          <div role="status" className={`${okBox} mt-4`}>
            {state.message}
          </div>
        )}

        <div className="mt-5 flex items-center justify-between gap-4">
          <p className="text-lg font-semibold text-indigo-900">Total: {money(total)}</p>
          <button
            type="submit"
            disabled={pending}
            className={`${primaryBtn} px-5 py-2.5`}
          >
            <span className={btnShine} />
            <span className="relative">{pending ? "Saving..." : "Record sale"}</span>
          </button>
        </div>
      </div>
    </form>
  );
}