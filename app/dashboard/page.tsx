import { requireUser } from "@/features/auth/current-user";
import { logoutAction } from "@/features/auth/login";

export default async function DashboardPage() {
  const user = await requireUser();
  const membership = user.memberships[0];

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">
            {membership?.business.name ?? "No business yet"}
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
            Welcome, {user.name}
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Signed in as {user.email}
            {membership ? ` · ${membership.role}` : ""}
          </p>
        </div>

        <form action={logoutAction}>
          <button
            type="submit"
            className="rounded-lg border border-slate-300 px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Sign out
          </button>
        </form>
      </div>
    </main>
  );
}
