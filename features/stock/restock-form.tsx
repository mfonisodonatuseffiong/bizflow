"use client";

import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { restockProductAction, type RestockFormState } from "@/features/stock/actions";

const inputClass =
  "block rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20";

export function RestockForm({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState<RestockFormState, FormData>(
    restockProductAction,
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

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-brand-600 hover:text-brand-700"
      >
        Restock
      </button>
    );
  }

  return (
    <div>
      <form ref={formRef} onSubmit={handleSubmit} className="flex flex-wrap items-center gap-2">
        <input type="hidden" name="productId" value={productId} />
        <input
          name="quantity"
          required
          inputMode="numeric"
          placeholder="Qty"
          aria-label={`Quantity to add to ${productName}`}
          className={`${inputClass} w-20`}
        />
        <input
          name="note"
          placeholder="Note (optional)"
          aria-label={`Note for restocking ${productName}`}
          className={`${inputClass} w-44`}
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-brand-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
        >
          {pending ? "Adding..." : "Add stock"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="px-2 py-2 text-xs font-medium text-slate-500 hover:text-slate-800"
        >
          Close
        </button>
      </form>
      {state.status === "error" ? (
        <p role="alert" className="mt-2 text-xs text-red-700">
          {state.message}
        </p>
      ) : null}
      {state.status === "success" ? (
        <p role="status" className="mt-2 text-xs text-brand-700">
          {state.message}
        </p>
      ) : null}
    </div>
  );
}
