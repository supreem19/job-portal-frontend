const filters = {
  Location: ["Delhi", "Mumbai", "Kolhapur", "Udaipur", "Mangalore", "Salem", "Chittoor", "Remote"],
  Industry: ["IT", "Finance", "Marketing", "Healthcare", "Education", "Manufacturing"],
  Experience: ["Fresher", "1–3 Years", "3–5 Years", "5+ Years"],
};

export default function FilterJobs() {
  return (
    <aside aria-label="Filter jobs" className="h-fit rounded-lg border border-zinc-100 bg-white p-5 shadow-sm lg:sticky lg:top-6">
      <h1 className="border-b border-zinc-200 pb-3 text-lg font-extrabold">Filter Jobs</h1>
      {Object.entries(filters).map(([group, values]) => (
        <fieldset key={group} className="mt-5">
          <legend className="text-base font-bold">{group}</legend>
          <div className="mt-3 space-y-2.5">
            {values.map((value, index) => {
              const id = `${group}-${value}`;
              return <label key={value} htmlFor={id} className="flex cursor-pointer items-center gap-2.5 text-sm text-zinc-600"><input id={id} name={group} type={group === "Industry" ? "radio" : "checkbox"} defaultChecked={group === "Industry" && index === 0} className="size-4 accent-zinc-900" />{value}</label>;
            })}
          </div>
        </fieldset>
      ))}
    </aside>
  );
}
