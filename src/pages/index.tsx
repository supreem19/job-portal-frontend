import Categories from "@/components/Categories";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import LatestJobs from "@/components/LatestJobs";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-zinc-950">
      <Navbar />
      <Header />
      <Categories />
      <LatestJobs />
      <Footer />
    </main>
  );
}
