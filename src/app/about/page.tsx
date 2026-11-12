import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";
import AboutMission from "@/components/AboutMission";
import AboutStats from "@/components/AboutStats";
import CareServices from "@/components/CareServices";
import Consultation from "@/components/Consultation"

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <PageBanner
          title="About Us"
          subtitle="More Than Helping Hands, We Bring Comfort, Care, and Peace of Mind."
          image="/images/about_bg.png"
          alt="Fawez care team smiling together"
        />
        <AboutMission />
        <AboutStats />
        <CareServices />
        <Consultation />
      </main>
      <Footer />
    </>
  );
}
