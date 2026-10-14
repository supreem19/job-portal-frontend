import JobCard from "@/components/JobCard";

const jobs = ["Frontend Developer", "Backend Developer", "React Developer", "Node.js Developer", "UI/UX Designer", "Software Engineer", "Product Designer", "DevOps Engineer", "Data Analyst"].map((title, index) => ({
  id: index + 1, company: ["Bright Labs", "Nexora Systems", "PixelCraft", "CloudWorks", "Studio Nine", "Vertex Tech", "Luma Digital", "Orbit Stack", "DataBridge"][index],
  location: index % 2 ? "Mumbai, India" : "Delhi, India", title,
  description: "Join a talented team building thoughtful products used by people around the world.",
  positions: "10 Positions", salary: "20 LPA", workMode: "Remote", employmentType: "Full Time",
}));

export default function Jobs() {
  return <section aria-label="Available jobs" className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{jobs.map((job) => <JobCard key={job.id} {...job} variant="detailed" />)}</section>;
}
