"use client";

import { startTransition, useActionState, useRef } from "react";
import { inviteMemberAction, type InviteState } from "@/features/team/actions";
import {
  btnShine,
  errorBox,
  inputClass,
  labelClass,
  okBox,
  primaryBtn,
} from "@/features/ui/glass";

export function InviteForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState<InviteState, FormData>(
    inviteMemberAction,
    { status: "idle" },
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const data = new FormData(event.currentTarget);
    startTransition(async () => {
      await formAction(data);
    });
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="mt-4">
      <div className="grid gap-3 sm:grid-cols-[1fr_10rem_auto] sm:items-end">
        <div>
          <label htmlFor="invite-email" className={labelClass}>
            Email address
          </label>
          <input
            id="invite-email"
            name="email"
            type="email"
            required
            placeholder="name@example.com"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="invite-role" className={labelClass}>
            Role
          </label>
          <select id="invite-role" name="role" defaultValue="STAFF" className={inputClass}>
            <option value="STAFF" className="text-indigo-900">Staff</option>
            <option value="MANAGER" className="text-indigo-900">Manager</option>
          </select>
        </div>
        <button type="submit" disabled={pending} className={`${primaryBtn} px-5 py-2.5`}>
          <span className={btnShine} />
          <span className="relative">{pending ? "Sending..." : "Send invite"}</span>
        </button>
      </div>

      {state.status === "error" && (
        <div role="alert" className={`${errorBox} mt-3`}>
          {state.message}
        </div>
      )}
      {state.status === "success" && (
        <div role="status" className={`${okBox} mt-3`}>
          <p>{state.message}</p>
          {state.link ? (
            <p className="mt-2 break-all font-mono text-xs">{state.link}</p>
          ) : null}
        </div>
      )}
    </form>
  );
}