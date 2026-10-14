import FilterJobs from "@/components/FilterJobs";
import Jobs from "@/components/Jobs";
import Navbar from "@/components/Navbar";

export default function JobsPage() {
  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-950">
      <Navbar />
      <div className="grid w-full gap-6 px-6 py-10 sm:px-10 lg:grid-cols-[15rem_1fr] lg:px-16">
        <FilterJobs />
        <Jobs />
      </div>
    </main>
  );
}
