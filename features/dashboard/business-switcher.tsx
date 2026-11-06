import Link from "next/link";
import { switchBusinessAction } from "@/features/auth/switch-business";

type Props = {
  businesses: { id: string; name: string }[];
  activeId: string;
};

export function BusinessSwitcher({ businesses, activeId }: Props) {
  const active = businesses.find((b) => b.id === activeId);

  return (
    <details className="relative">
      <summary className="flex cursor-pointer list-none items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium">
        <span className="max-w-40 truncate">{active?.name ?? "Select business"}</span>
        <span aria-hidden>▾</span>
      </summary>
      <div className="absolute right-0 z-50 mt-2 w-64 rounded-xl border bg-white p-1 shadow-lg">
        {businesses.map((b) => (
          <form key={b.id} action={switchBusinessAction}>
            <input type="hidden" name="businessId" value={b.id} />
            <button
              type="submit"
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm hover:bg-black/5"
            >
              <span className="truncate">{b.name}</span>
              {b.id === activeId && <span aria-hidden>✓</span>}
            </button>
          </form>
        ))}
        <Link
          href="/onboarding?new=1"
          className="mt-1 block rounded-lg border-t px-3 py-2 text-sm hover:bg-black/5"
        >
          + Create another business
        </Link>
      </div>
    </details>
  );
}