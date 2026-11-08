import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";
import AboutMission from "@/components/AboutMission";
import AboutStats from "@/components/AboutStats";
import CareServices from "@/components/CareServices";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <PageBanner
          title="About Us"
          subtitle="In A Home Care That Elevates The Human Spirit"
          image="/images/about_bg.png"
          alt="Fawez care team smiling together"
        />
        <AboutMission />
        <AboutStats />
        <CareServices />
      </main>
      <Footer />
    </>
  );
}
