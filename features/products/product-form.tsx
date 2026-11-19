"use client";

import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { createProductAction, type ProductFormState } from "@/features/products/actions";
import { createCategoryAction } from "@/features/categories/actions";

const inputClass =
  "block w-full rounded-xl border border-white/80 bg-white/60 px-3.5 py-2.5 text-base text-indigo-900 shadow-sm placeholder:text-indigo-800/40 transition focus:border-fuchsia-500 focus:bg-white/80 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/30 sm:text-sm";

const labelClass = "mb-1.5 block text-sm font-semibold text-indigo-900";

type CategoryOption = { id: string; name: string };

export function ProductForm({
  currency,
  categories,
}: {
  currency: string;
  categories: CategoryOption[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState<ProductFormState, FormData>(
    createProductAction,
    { status: "idle" },
  );

  const [categoryId, setCategoryId] = useState("");
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);

  // Reset the category when a save succeeds. Adjusting state during render
  // is the pattern React recommends instead of calling setState in an effect.
  const [handledState, setHandledState] = useState(state);
  if (state !== handledState) {
    setHandledState(state);
    if (state.status === "success") setCategoryId("");
  }

  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return; // ignore clicks while a save is in flight
    const data = new FormData(event.currentTarget);
    startTransition(() => formAction(data));
  }

  function handleAddCategory() {
    if (creatingCategory) return;
    setCreatingCategory(true);
    startTransition(async () => {
      try {
        const result = await createCategoryAction(newCategory);
        if (result.status === "success") {
          toast.success(`Category “${newCategory.trim()}” added.`);
          setCategoryId(result.id);
          setNewCategory("");
          setShowNewCategory(false);
        } else {
          toast.error(result.message);
        }
      } catch {
        toast.error("Could not add the category. Please try again.");
      } finally {
        setCreatingCategory(false);
      }
    });
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="relative overflow-hidden rounded-2xl border border-white/70 bg-white/45 p-5 text-indigo-900 shadow-[0_10px_35px_rgba(124,58,237,0.18),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-xl sm:p-6"
    >
      {/* Orange-to-fuchsia-to-indigo line across the top */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-linear-to-r from-orange-400 via-fuchsia-500 to-indigo-500"
      />
      {/* Fuchsia glow in the corner */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-fuchsia-400/30 blur-3xl"
      />

      <div className="relative">
        <h2 className="text-base font-semibold text-indigo-900">Add a product</h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
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
            <label htmlFor="categoryId" className={labelClass}>
              Category (optional)
            </label>
            <select
              id="categoryId"
              name="categoryId"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className={inputClass}
            >
              <option value="">No category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setShowNewCategory((v) => !v)}
              className="mt-1.5 text-xs font-semibold text-fuchsia-700 hover:underline"
            >
              {showNewCategory ? "Cancel" : "+ New category"}
            </button>
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

        {showNewCategory && (
          <div className="mt-4 flex flex-col gap-2 sm:max-w-md sm:flex-row">
            <input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddCategory();
                }
              }}
              placeholder="New category name, e.g. Noodles"
              className={inputClass}
            />
            <button
              type="button"
              onClick={handleAddCategory}
              disabled={creatingCategory || newCategory.trim().length < 2}
              className="rounded-xl border border-white/80 bg-white/70 px-4 py-2.5 text-sm font-semibold text-indigo-900 transition hover:border-fuchsia-400/60 hover:bg-white disabled:opacity-50"
            >
              {creatingCategory ? "Adding..." : "Add category"}
            </button>
          </div>
        )}

        {state.status === "error" ? (
          <div
            role="alert"
            className="mt-4 rounded-xl border border-red-300 bg-red-100/80 px-4 py-3 text-sm font-medium text-red-700"
          >
            {state.message}
          </div>
        ) : null}
        {state.status === "success" ? (
          <div
            role="status"
            className="mt-4 rounded-xl border border-emerald-300 bg-emerald-100/80 px-4 py-3 text-sm font-medium text-emerald-700"
          >
            {state.message}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="group relative mt-4 w-full overflow-hidden rounded-xl bg-linear-to-r from-indigo-600 via-violet-600 to-fuchsia-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(109,40,217,0.45)] ring-1 ring-white/40 transition duration-300 hover:scale-[1.02] hover:shadow-[0_10px_40px_rgba(109,40,217,0.65)] focus:outline-none focus:ring-2 focus:ring-fuchsia-500/60 focus:ring-offset-2 focus:ring-offset-pink-100 disabled:opacity-60 disabled:hover:scale-100 sm:w-auto"
        >
          <span className="pointer-events-none absolute inset-x-3 top-0 h-1/2 rounded-b-full bg-linear-to-b from-white/35 to-transparent" />
          <span className="relative">{pending ? "Adding..." : "Add product"}</span>
        </button>
      </div>
    </form>
  );
}