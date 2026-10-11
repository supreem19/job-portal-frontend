import { ArrowLeft, ArrowRight } from "lucide-react";

const categories = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Scientist",
];

export default function Categories() {
  return (
    <section
      id="categories"
      aria-labelledby="categories-heading"
      className="mx-auto max-w-5xl px-6 py-16 sm:py-20"
    >
      <div className="text-center">
        <h2
          id="categories-heading"
          className="text-2xl font-extrabold tracking-tight text-[#2864c7] sm:text-3xl"
        >
          Categories
        </h2>
        <p className="mt-1 text-zinc-500">Explore our extensive job market.</p>
      </div>
      <div className="mx-auto mt-10 flex max-w-3xl items-center justify-between gap-4">
        <button
          type="button"
          aria-label="Previous categories"
          className="grid size-10 shrink-0 place-items-center rounded-full border border-zinc-100 text-zinc-500 shadow-sm transition hover:bg-zinc-100"
        >
          <ArrowLeft size={18} aria-hidden="true" />
        </button>
        <div className="flex flex-1 flex-wrap justify-center gap-4 sm:justify-between">
          {categories.slice(0, 3).map((category) => (
            <span
              key={category}
              className="rounded-md bg-zinc-900 px-5 py-3 text-sm font-bold text-white shadow-sm"
            >
              {category}
            </span>
          ))}
        </div>
        <button
          type="button"
          aria-label="Next categories"
          className="grid size-10 shrink-0 place-items-center rounded-full border border-zinc-100 text-zinc-500 shadow-sm transition hover:bg-zinc-100"
        >
          <ArrowRight size={18} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
