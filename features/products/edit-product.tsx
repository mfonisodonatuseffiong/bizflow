"use client";

import { startTransition, useActionState, useEffect, useRef } from "react";
import { updateProductAction, type ProductFormState } from "@/features/products/actions";

const inputClass =
  "block w-full rounded-lg border border-white/15 bg-brand-700/60 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/40";

export function EditProduct({
  product,
  categories,
}: {
  product: {
    id: string;
    name: string;
    sku: string | null;
    priceMinor: number;
    categoryId: string | null;
  };
  categories: { id: string; name: string }[];
}) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const [state, formAction, pending] = useActionState<ProductFormState, FormData>(
    updateProductAction,
    { status: "idle" },
  );

  useEffect(() => {
    if (state.status === "success" && detailsRef.current) detailsRef.current.open = false;
  }, [state]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const data = new FormData(event.currentTarget);
    startTransition(() => formAction(data));
  }

  return (
    <details ref={detailsRef} className="relative">
      <summary className="cursor-pointer list-none rounded-lg border border-white/15 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/5">
        Edit
      </summary>
      <form
        onSubmit={handleSubmit}
        className="absolute right-0 z-10 mt-2 w-72 space-y-3 rounded-xl border border-white/10 bg-card p-4 shadow-2xl shadow-black/50"
      >
        <input type="hidden" name="productId" value={product.id} />
        <input name="name" required minLength={2} defaultValue={product.name} placeholder="Name" className={inputClass} />
        <input name="sku" defaultValue={product.sku ?? ""} placeholder="SKU (optional)" className={inputClass} />
        <select
          name="categoryId"
          defaultValue={product.categoryId ?? ""}
          className={inputClass}
        >
          <option value="">No category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <input
          name="price"
          required
          inputMode="decimal"
          defaultValue={(product.priceMinor / 100).toFixed(2)}
          placeholder="Price"
          className={inputClass}
        />
        {state.status === "error" && (
          <p role="alert" className="text-xs text-red-300">{state.message}</p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-accent-500 px-3 py-2 text-sm font-semibold text-white hover:bg-accent-600 disabled:opacity-60"
        >
          {pending ? "Saving..." : "Save changes"}
        </button>
      </form>
    </details>
  );
}