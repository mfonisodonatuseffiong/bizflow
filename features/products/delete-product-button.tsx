"use client";

import { useState, useSyncExternalStore, useTransition } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { deleteProductWithStatusAction } from "./actions";

/* true in the browser, false on the server (so the portal only renders client-side) */
const subscribe = () => () => {};

export function DeleteProductButton({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  function onConfirm() {
    startTransition(async () => {
      try {
        const result = await deleteProductWithStatusAction(productId);
        if (result.status === "success") {
          setOpen(false);
          toast.success(`“${productName}” was deleted.`);
        } else {
          toast.error(result.message);
        }
      } catch {
        toast.error("Could not delete the product. Please try again.");
      }
    });
  }

  const popup = open ? (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-indigo-900/30 p-4 backdrop-blur-sm"
      onClick={() => !pending && setOpen(false)}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-white/80 bg-pink-100/95 p-6 text-indigo-900 shadow-[0_25px_70px_rgba(109,40,217,0.4)] backdrop-blur-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Red-to-orange line across the top */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-linear-to-r from-red-500 via-rose-500 to-orange-400"
        />
        {/* Soft red glow behind the icon */}
        <div className="pointer-events-none absolute -top-14 left-6 h-36 w-36 rounded-full bg-rose-400/40 blur-3xl" />

        <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-red-500 to-rose-500 text-white shadow-[0_8px_24px_rgba(244,63,94,0.5)]">
          <svg
            viewBox="0 0 24 24"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 002 2h6a2 2 0 002-2l1-12M9 7V4h6v3" />
          </svg>
        </span>

        <h2 className="relative mt-4 text-lg font-semibold text-indigo-900">
          Delete product?
        </h2>
        <p className="relative mt-2 text-sm leading-relaxed text-indigo-800/80">
          “{productName}” will be removed from your product list. Past sales
          that include it will not be affected.
        </p>
        <div className="relative mt-6 flex justify-end gap-3">
          <button
            type="button"
            disabled={pending}
            onClick={() => setOpen(false)}
            className="rounded-xl border border-white/80 bg-white/70 px-4 py-2 text-sm font-semibold text-indigo-900 transition hover:border-fuchsia-400/60 hover:bg-white disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={onConfirm}
            className="rounded-xl bg-linear-to-r from-red-600 to-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_8px_22px_rgba(225,29,72,0.45)] ring-1 ring-white/40 transition hover:shadow-[0_8px_30px_rgba(225,29,72,0.65)] disabled:opacity-50"
          >
            {pending ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-sm font-semibold text-red-600 transition hover:text-red-700 hover:underline"
      >
        Delete
      </button>

      {mounted && popup ? createPortal(popup, document.body) : null}
    </>
  );
}