"use client";

import { startTransition, useActionState, useEffect, useRef } from "react";
import { createCustomerAction, type CustomerFormState } from "@/features/customers/actions";
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

export function CustomerForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState<CustomerFormState, FormData>(
    createCustomerAction,
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
    <form ref={formRef} onSubmit={handleSubmit} className={formCard}>
      <span aria-hidden="true" className={topLine} />
      <span aria-hidden="true" className={cornerGlow} />

      <div className="relative">
        <h2 className="text-base font-semibold text-indigo-900">Add a customer</h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label htmlFor="name" className={labelClass}>Name</label>
            <input
              id="name"
              name="name"
              required
              minLength={2}
              placeholder="e.g. Ama Mensah"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="phone" className={labelClass}>Phone (optional)</label>
            <input
              id="phone"
              name="phone"
              inputMode="tel"
              placeholder="e.g. 024 123 4567"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="email" className={labelClass}>Email (optional)</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="ama@example.com"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="address" className={labelClass}>Address (optional)</label>
            <input
              id="address"
              name="address"
              placeholder="e.g. Madina, Accra"
              className={inputClass}
            />
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

        <button
          type="submit"
          disabled={pending}
          className={`${primaryBtn} mt-4 w-full px-5 py-2.5 sm:w-auto`}
        >
          <span className={btnShine} />
          <span className="relative">{pending ? "Adding..." : "Add customer"}</span>
        </button>
      </div>
    </form>
  );
}