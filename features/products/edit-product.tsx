"use client";

import { startTransition, useActionState, useEffect, useRef } from "react";
import { updateProductAction, type ProductFormState } from "@/features/products/actions";

const inputClass =
  "block w-full rounded-lg border border-white/80 bg-white/70 px-3 py-2 text-sm text-indigo-900 placeholder:text-indigo-800/40 transition focus:border-fuchsia-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500/30";

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
      <summary className="cursor-pointer list-none rounded-lg border border-white/80 bg-white/60 px-3 py-1.5 text-xs font-semibold text-indigo-900 shadow-sm transition hover:border-fuchsia-400/60 hover:bg-white/85 hover:text-fuchsia-700">
        Edit
      </summary>
      <form
        onSubmit={handleSubmit}
        className="absolute right-0 z-10 mt-2 w-72 space-y-3 overflow-hidden rounded-2xl border border-white/80 bg-pink-100/95 p-4 text-indigo-900 shadow-[0_20px_50px_rgba(109,40,217,0.35)] backdrop-blur-2xl"
      >
        {/* Orange-to-fuchsia-to-indigo line across the top */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-linear-to-r from-orange-400 via-fuchsia-500 to-indigo-500"
        />

        <input type="hidden" name="productId" value={product.id} />
        <input name="name" required minLength={2} defaultValue={product.name} placeholder="Name" className={`${inputClass} mt-1`} />
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
          <p role="alert" className="text-xs font-medium text-red-700">{state.message}</p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-linear-to-r from-indigo-600 via-violet-600 to-fuchsia-600 px-3 py-2 text-sm font-semibold text-white shadow-[0_8px_22px_rgba(109,40,217,0.4)] ring-1 ring-white/40 transition hover:shadow-[0_8px_30px_rgba(109,40,217,0.6)] disabled:opacity-60"
        >
          {pending ? "Saving..." : "Save changes"}
        </button>
      </form>
    </details>
  );
}