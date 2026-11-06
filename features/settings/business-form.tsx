"use client";

import { startTransition, useActionState } from "react";
import {
  updateBusinessNameAction,
  type BusinessNameState,
} from "@/features/settings/actions";
import {
  btnShine,
  errorBox,
  inputClass,
  labelClass,
  okBox,
  primaryBtn,
} from "@/features/ui/glass";

export function BusinessNameForm({ name }: { name: string }) {
  const [state, formAction, pending] = useActionState<BusinessNameState, FormData>(
    updateBusinessNameAction,
    { status: "idle" },
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    startTransition(() => formAction(data));
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name" className={labelClass}>
        Business name
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id="name"
          name="name"
          required
          minLength={2}
          maxLength={80}
          defaultValue={name}
          className={inputClass}
        />
        <button
          type="submit"
          disabled={pending}
          className={`${primaryBtn} shrink-0 px-5 py-2.5`}
        >
          <span className={btnShine} />
          <span className="relative">{pending ? "Saving..." : "Save"}</span>
        </button>
      </div>

      {state.status === "error" ? (
        <div role="alert" className={`${errorBox} mt-3`}>
          {state.message}
        </div>
      ) : null}
      {state.status === "success" ? (
        <div role="status" className={`${okBox} mt-3`}>
          {state.message}
        </div>
      ) : null}
    </form>
  );
}