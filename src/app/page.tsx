import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Blogs from "@/components/Blogs";
import Testimonials from "@/components/Testimonials";
import Consultation from "@/components/Consultation";
import CareServices from "@/components/CareServices";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <About />
        <Services />
        <CareServices />
        <Blogs />
        <Testimonials />
        <Consultation />
      </main>
      <Footer />
    </>
  );
}
