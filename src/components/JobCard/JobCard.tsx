import { Bookmark } from "lucide-react";

type JobCardProps = {
  company: string; location: string; title: string; description: string;
  positions: string; salary: string; workMode: string; employmentType: string;
  variant?: "compact" | "detailed";
  postedAt?: string;
};

export default function JobCard({ company, location, title, description, positions, salary, workMode, employmentType, variant = "compact", postedAt = "3 days ago" }: JobCardProps) {
  return (
    <article className="flex min-h-56 flex-col rounded-lg border border-zinc-100 bg-white p-5 shadow-[0_10px_18px_rgba(0,0,0,0.08)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_14px_24px_rgba(0,0,0,0.12)]">
      {variant === "detailed" && <div className="flex items-center justify-between text-sm text-zinc-500"><span>{postedAt}</span><button type="button" aria-label={`Save ${title}`} className="grid size-9 place-items-center rounded-full border border-zinc-100 text-zinc-600 hover:bg-zinc-100"><Bookmark size={17} /></button></div>}
      <div className={variant === "detailed" ? "mt-3 flex items-center gap-3" : ""}>
        {variant === "detailed" && <div className="grid size-12 shrink-0 place-items-center rounded-md bg-violet-100 text-lg font-extrabold text-violet-700">{company.charAt(0)}</div>}
        <div><p className="text-lg font-bold text-zinc-800">{company}</p><p className="mt-0.5 text-sm text-zinc-500">{location}</p></div>
      </div>
      <h3 className="mt-3 text-lg font-extrabold text-zinc-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-zinc-500">{description}</p>
      <div className="mt-auto flex flex-wrap gap-2 pt-5 text-xs font-bold">
        <span className="rounded border border-blue-100 bg-blue-50 px-2.5 py-1 text-blue-700">{positions}</span>
        <span className="rounded border border-orange-100 bg-orange-50 px-2.5 py-1 text-orange-700">{salary}</span>
        <span className="rounded border border-violet-100 bg-violet-50 px-2.5 py-1 text-violet-700">{workMode}</span>
        <span className="rounded border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-zinc-800">{employmentType}</span>
      </div>
      {variant === "detailed" && <div className="mt-4 flex gap-3"><button type="button" className="rounded border border-zinc-200 px-4 py-2 text-sm font-bold hover:bg-zinc-50">Details</button><button type="button" className="rounded bg-[#652bc4] px-4 py-2 text-sm font-bold text-white hover:bg-[#5423a5]">Save For Later</button></div>}
    </article>
  );
}
