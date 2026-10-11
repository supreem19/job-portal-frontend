import JobCard from "@/components/JobCard";

const jobs = ["Frontend Developer", "Backend Developer", "React Developer", "Node.js Developer", "UI/UX Designer", "Software Engineer"].map((title, index) => ({
  id: index + 1,
  company: ["Bright Labs", "Nexora Systems", "PixelCraft", "CloudWorks", "Studio Nine", "Vertex Tech"][index],
  location: "India", title,
  description: "Join a talented team building thoughtful products used by people around the world.",
  positions: "10 Positions", salary: "20 LPA", workMode: "Remote", employmentType: "Full Time",
}));

export default function LatestJobs() {
  return (
    <section id="latest-jobs" aria-labelledby="latest-jobs-heading" className="w-full px-6 pb-20 pt-8 sm:px-10 sm:pb-24 lg:px-16">
      <h2 id="latest-jobs-heading" className="text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl"><span className="text-[#652bc4]">Latest &amp; Top</span> Job Openings</h2>
      <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => <JobCard key={job.id} {...job} />)}
      </div>
    </section>
  );
}
