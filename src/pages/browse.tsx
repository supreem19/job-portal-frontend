import Jobs from "@/components/Jobs";
import Navbar from "@/components/Navbar";

export default function BrowsePage() {
  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-950">
      <Navbar />
      <div className="w-full px-6 py-10 sm:px-10 lg:px-16">
        <Jobs />
      </div>
    </main>
  );
}
