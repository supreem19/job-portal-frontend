import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-950 text-zinc-300">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div><p className="text-xl font-extrabold text-white">Job <span className="text-[#8b5cf6]">Portal</span></p><p className="mt-1 text-sm text-zinc-400">Find work that moves your career forward.</p></div>
        <nav aria-label="Footer navigation" className="flex gap-5 text-sm font-medium"><Link href="/" className="transition hover:text-white">Home</Link><a href="#categories" className="transition hover:text-white">Browse</a><a href="#latest-jobs" className="transition hover:text-white">Jobs</a></nav>
        <p className="text-sm text-zinc-500">© {new Date().getFullYear()} Job Portal</p>
      </div>
    </footer>
  );
}
