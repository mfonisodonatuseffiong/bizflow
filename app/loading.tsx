import { Logo } from "@/features/ui/logo";

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-slate-950">
      <Logo size={64} animated />
      <p className="text-sm tracking-widest text-slate-400">LOADING BIZFLOW</p>
    </div>
  );
}
