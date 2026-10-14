const applications = [
  { date: "23-12-2024", role: "Software Engineer", company: "Microsoft", status: "Selected" },
  { date: "18-12-2024", role: "Frontend Developer", company: "Bright Labs", status: "In Review" },
  { date: "12-12-2024", role: "Backend Developer", company: "Nexora Systems", status: "Applied" },
];

export default function AppliedJobs() {
  return (
    <section aria-labelledby="applied-jobs-heading" className="mt-8">
      <h2 id="applied-jobs-heading" className="text-xl font-extrabold text-zinc-900">Applied Jobs</h2>
      <div className="mt-4 overflow-x-auto rounded-lg border border-zinc-200 bg-white">
        <table className="w-full min-w-160 text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-zinc-500"><tr><th className="px-5 py-4 font-semibold">Date</th><th className="px-5 py-4 font-semibold">Job Title</th><th className="px-5 py-4 font-semibold">Company</th><th className="px-5 py-4 font-semibold">Status</th></tr></thead>
          <tbody>
            {applications.map((application) => <tr key={`${application.date}-${application.company}`} className="border-b border-zinc-100 last:border-0"><td className="px-5 py-4 text-zinc-600">{application.date}</td><td className="px-5 py-4 font-medium">{application.role}</td><td className="px-5 py-4 text-zinc-600">{application.company}</td><td className="px-5 py-4"><span className="rounded bg-zinc-900 px-3 py-1 text-xs font-bold text-white">{application.status}</span></td></tr>)}
          </tbody>
        </table>
      </div>
    </section>
  );
}
