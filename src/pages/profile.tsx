import AppliedJobs from "@/components/AppliedJobs";
import Navbar from "@/components/Navbar";
import Profile from "@/components/Profile";

export default function ProfilePage() {
  return <main className="min-h-screen bg-zinc-50 text-zinc-950"><Navbar /><div className="w-full px-6 py-10 sm:px-10 lg:px-16"><Profile /><AppliedJobs /></div></main>;
}
