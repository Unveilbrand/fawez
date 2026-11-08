import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Consultation from "@/components/Consultation";
import PageBanner from "@/components/PageBanner";
import { services } from "@/components/Services";
import BookAppointment from "@/components/BookAppointment";

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <PageBanner
          title="Our Services"
          subtitle="More Than Helping Hands, We Bring Comfort, Care, and Peace of Mind."
          image="/images/services_bg.png"
          position="object-[50%_30%]"
          alt="Caregiver smiling with an elderly woman at home"
        />

        <section className="py-16 md:py-24">
          <div className="site-container">
            <h2 className="text-center text-3xl font-bold text-black sm:text-4xl lg:text-[36px]">
              Our Services
            </h2>
            <p className="mx-auto mt-6 max-w-[720px] text-center text-sm leading-relaxed font-semibold text-black lg:text-base">
              As non-medical caregivers, we work in households, senior homes, or assisted living
              facilities where we run errands, companions, clean, do laundry, and organize as
              requested by the clients or their families.
            </p>

            <div className="mx-auto mt-12 max-w-[1000px] space-y-8 lg:mt-16">
              {services.map(({ title, description, image, imageZoom }, i) => (
                <article
                  key={title}
                  className="overflow-hidden rounded-xl bg-[#D6E9FF] lg:flex lg:h-[340px] lg:px-5 lg:py-5 lg:rounded-[20px]"
                >
                  <div
                    role="img"
                    aria-label={title}
                    style={
                      imageZoom
                        ? {
                            backgroundImage: `url(${image})`,
                            backgroundSize: "170%",
                            backgroundPosition: "50% 25%",
                          }
                        : { backgroundImage: `url(${image})` }
                    }
                    className={`aspect-[430/261] rounded-xl bg-cover bg-center lg:aspect-auto lg:h-full lg:w-[400px] lg:shrink-0 lg:rounded-[10px] ${
                      i % 2 === 1 ? "lg:order-2" : ""
                    }`}
                  />
                  <div
                    className={`flex flex-1 flex-col justify-center overflow-hidden px-6 py-8 sm:px-10 lg:px-12 lg:py-6 ${
                      i % 2 === 1 ? "lg:order-1" : ""
                    }`}
                  >
                    <h3 className="text-2xl font-bold text-black sm:text-3xl lg:text-[30px] lg:leading-tight">
                      {title}
                    </h3>
                    <p className="mt-4 max-w-[440px] text-sm leading-relaxed text-black lg:text-base">
                      {description}
                    </p>
                    <BookAppointment subject={title} />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <Consultation />
      </main>
      <Footer />
    </>
  );
}
