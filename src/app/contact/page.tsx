import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import PageBanner from "@/components/PageBanner";

const contactCards = [
  {
    title: "Call us today",
    text: "You can call our expert team (847)-600-3096, (773)-544-3775 or send a fax to (847)-600-3089 for enquiries.",
    action: "Call us now",
    href: "tel:+18476003096",
  },
  {
    title: "Send an email",
    text: "Send our team an email and we'll get back to you shortly",
    action: "Email us now",
    href: "mailto:admin@fawezhelpinghands.com",
  },
];

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <PageBanner
          title="Contact Us"
          subtitle="Reach our friendly team for appointments, consultations, and personalized assistance."
          image="/images/contact_bg.png"
          position="object-[50%_30%]"
          alt="Caregiver smiling with an elderly woman at home"
        />

        <section className="bg-[#F7FAFF] py-16 md:py-24">
          <div className="site-container grid gap-12 lg:grid-cols-[35fr_65fr] lg:gap-24">
            <div className="flex max-w-[480px] flex-col lg:max-w-none">
              <p className="flex items-center gap-2 text-sm font-medium tracking-widest text-primary uppercase">
                <span className="relative flex size-1.5">
                  <span className="absolute inline-flex size-full animate-ping bg-primary" />
                  <span className="relative inline-flex size-1.5 bg-primary" />
                </span>
                Reach Out
              </p>
              <h2 className="mt-4 text-3xl font-bold text-black sm:text-4xl lg:text-[36px]">
                Speak With Our Experts
              </h2>
              <p className="mt-5 max-w-[400px] text-sm leading-relaxed text-black lg:text-base">
                A team of experienced professionals ready to provide compassionate care and
                reliable healthcare support every day.
              </p>
              <div className="mt-10 h-[260px] flex-none overflow-hidden rounded-xl border border-[#CFE3F7] sm:h-[300px] lg:h-[320px]">
                <iframe
                  title="Fawez Helping Hands — 5875 N Lincoln Avenue STE 110, Chicago IL 60659"
                  src="https://maps.google.com/maps?q=5875%20N%20Lincoln%20Avenue%20STE%20110%2C%20Chicago%2C%20IL%2060659&z=15&output=embed"
                  className="size-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
              <div className="hidden min-h-8 flex-1 lg:block" aria-hidden />
              <div className="relative mt-8 h-[220px] flex-none overflow-hidden rounded-xl sm:h-[260px] lg:mt-6 lg:h-[280px]">
                <Image
                  src="/images/contact_img.avif"
                  alt="Care professional reviewing a care plan on a tablet"
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>

            <div>
              <ContactForm />
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                {contactCards.map(({ title, text, action, href }) => (
                  <div
                    key={title}
                    className="rounded-2xl bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)]"
                  >
                    <h3 className="text-lg font-semibold text-black">{title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-black">{text}</p>
                    <a
                      href={href}
                      className="mt-5 inline-block rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
                    >
                      {action}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
