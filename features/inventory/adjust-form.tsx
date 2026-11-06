"use client";

import { startTransition, useActionState, useEffect, useRef } from "react";
import { adjustStockAction, type StockFormState } from "@/features/inventory/actions";
import {
  btnShine,
  cornerGlow,
  errorBox,
  formCard,
  inputClass,
  labelClass,
  okBox,
  primaryBtn,
  topLine,
} from "@/features/ui/glass";

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
      className={`${formCard} grid gap-4 sm:grid-cols-2`}
    >
      <span aria-hidden="true" className={topLine} />
      <span aria-hidden="true" className={cornerGlow} />

      <div className="relative sm:col-span-2">
        <label htmlFor="productId" className={labelClass}>Product</label>
        <select
          id="productId"
          name="productId"
          required
          defaultValue=""
          className={inputClass}
        >
          <option value="" disabled className="text-indigo-900">
            Select a product
          </option>
          {products.map((p) => (
            <option key={p.id} value={p.id} className="text-indigo-900">
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div className="relative">
        <label htmlFor="kind" className={labelClass}>Change type</label>
        <select
          id="kind"
          name="kind"
          required
          defaultValue="RESTOCK"
          className={inputClass}
        >
          <option value="RESTOCK" className="text-indigo-900">Restock (add)</option>
          <option value="ADJUSTMENT" className="text-indigo-900">
            Adjustment (+/-)
          </option>
        </select>
      </div>

      <div className="relative">
        <label htmlFor="quantity" className={labelClass}>Quantity</label>
        <input
          id="quantity"
          name="quantity"
          type="number"
          step={1}
          required
          placeholder="e.g. 24 or -3"
          className={inputClass}
        />
      </div>

      <div className="relative sm:col-span-2">
        <label htmlFor="note" className={labelClass}>Note (optional)</label>
        <input
          id="note"
          name="note"
          type="text"
          maxLength={200}
          placeholder="e.g. Supplier delivery, damaged items"
          className={inputClass}
        />
      </div>

      {state.status === "error" && (
        <div role="alert" className={`${errorBox} relative sm:col-span-2`}>
          {state.message}
        </div>
      )}
      {state.status === "success" && (
        <div role="status" className={`${okBox} relative sm:col-span-2`}>
          {state.message}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className={`${primaryBtn} px-4 py-3 sm:col-span-2`}
      >
        <span className={btnShine} />
        <span className="relative">{pending ? "Saving..." : "Update stock"}</span>
      </button>
    </form>
  );
}