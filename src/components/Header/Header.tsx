import { Building2, Search } from "lucide-react";

export default function Header() {
  return (
    <section className="mx-auto flex max-w-5xl flex-col items-center px-6 pb-10 pt-16 text-center sm:pb-12 sm:pt-20 lg:pt-24">
      <p className="inline-flex items-center gap-2 rounded-full bg-[#f1eef5] px-4 py-2 text-sm font-bold text-[#a34242]">
        <Building2 size={16} strokeWidth={2.25} aria-hidden="true" />
        No.1 Job Hunt Website
      </p>

      <h1 className="mt-7 max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
        Search Apply &amp;
        <br />
        Get Your <span className="text-[#652bc4]">Dream Job</span>
      </h1>

      <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg">
        Start your hunt for the best, life-changing career opportunities from here in your
        selected areas conveniently and get hired quickly.
      </p>

      <form className="mt-7 flex w-full max-w-2xl overflow-hidden rounded-2xl border border-zinc-200 bg-white p-1 shadow-[0_8px_20px_rgba(0,0,0,0.10)]" role="search">
        <label htmlFor="job-search" className="sr-only">Search jobs</label>
        <input
          id="job-search"
          type="search"
          placeholder="Find Your Dream Job"
          className="min-w-0 flex-1 px-3 text-base text-zinc-900 outline-none placeholder:text-zinc-400 sm:px-4"
        />
        <button type="submit" className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#18181b] text-white transition hover:bg-[#3f3f46]" aria-label="Search jobs">
          <Search size={20} aria-hidden="true" />
        </button>
      </form>
    </section>
  );
}
