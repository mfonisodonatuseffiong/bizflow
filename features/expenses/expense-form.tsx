"use client";

import { startTransition, useActionState, useEffect, useRef } from "react";
import { expenseCategories } from "@/features/expenses/categories";
import { createExpenseAction, type ExpenseFormState } from "@/features/expenses/actions";
import {
  btnShine,
  cornerGlow,
  errorBox,
  formCard,
  inputClass,
  labelClass,
  okBox,
  primaryBtn,
  selectClass,
  topLine,
} from "@/features/ui/glass";

export function ExpenseForm({
  currency,
  today,
}: {
  currency: string;
  today: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState<ExpenseFormState, FormData>(
    createExpenseAction,
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
    <form ref={formRef} onSubmit={handleSubmit} className={formCard}>
      <span aria-hidden="true" className={topLine} />
      <span aria-hidden="true" className={cornerGlow} />

      <div className="relative">
        <h2 className="text-base font-semibold text-indigo-900">Add an expense</h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <label htmlFor="description" className={labelClass}>
              Description
            </label>
            <input
              id="description"
              name="description"
              required
              minLength={2}
              maxLength={120}
              placeholder="e.g. Shop rent for October"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="category" className={labelClass}>
              Category
            </label>
            <div className="relative">
              <select
                id="category"
                name="category"
                required
                defaultValue=""
                className={selectClass}
              >
                <option value="" disabled>
                  Select a category
                </option>
                {expenseCategories.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
              <svg
                viewBox="0 0 20 20"
                className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-fuchsia-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 8l5 5 5-5" />
              </svg>
            </div>
          </div>

          <div>
            <label htmlFor="amount" className={labelClass}>
              Amount ({currency})
            </label>
            <input
              id="amount"
              name="amount"
              required
              inputMode="decimal"
              placeholder="2500.00"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="spentAt" className={labelClass}>
              Date
            </label>
            <input
              id="spentAt"
              name="spentAt"
              type="date"
              required
              defaultValue={today}
              max={today}
              className={inputClass}
            />
          </div>
        </div>

        {state.status === "error" ? (
          <div role="alert" className={`${errorBox} mt-4`}>
            {state.message}
          </div>
        ) : null}
        {state.status === "success" ? (
          <div role="status" className={`${okBox} mt-4`}>
            {state.message}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className={`${primaryBtn} mt-4 w-full px-5 py-2.5 sm:w-auto`}
        >
          <span className={btnShine} />
          <span className="relative">{pending ? "Adding..." : "Add expense"}</span>
        </button>
      </div>
    </form>
  );
}