"use client";

import { startTransition, useActionState, useEffect, useRef } from "react";
import { recordPaymentAction, type PaymentFormState } from "@/features/payments/actions";
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

type Option = { id: string; label: string };

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
    <form ref={formRef} onSubmit={handleSubmit} className={formCard}>
      <span aria-hidden="true" className={topLine} />
      <span aria-hidden="true" className={cornerGlow} />

      <div className="relative">
        <h2 className="text-base font-semibold text-indigo-900">Record a payment</h2>

        {options.length === 0 ? (
          <p className="mt-3 text-sm text-indigo-800/70">
            No sales are waiting for payment.
          </p>
        ) : (
          <>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="saleId" className={labelClass}>Sale</label>
                <select
                  id="saleId"
                  name="saleId"
                  required
                  defaultValue=""
                  className={inputClass}
                >
                  <option value="" disabled className="text-indigo-900">
                    Select a sale
                  </option>
                  {options.map((o) => (
                    <option key={o.id} value={o.id} className="text-indigo-900">
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="amount" className={labelClass}>
                  Amount ({currency})
                </label>
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
                <select
                  id="method"
                  name="method"
                  defaultValue="CASH"
                  className={inputClass}
                >
                  <option value="CASH" className="text-indigo-900">Cash</option>
                  <option value="TRANSFER" className="text-indigo-900">
                    Bank transfer
                  </option>
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

            <button
              type="submit"
              disabled={pending}
              className={`${primaryBtn} mt-4 w-full px-5 py-2.5 sm:w-auto`}
            >
              <span className={btnShine} />
              <span className="relative">
                {pending ? "Saving..." : "Record payment"}
              </span>
            </button>
          </>
        )}
      </div>
    </form>
  );
}