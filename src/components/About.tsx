import Image from "next/image";
import Link from "next/link";

export default function About() {
  return (
    <section className="py-16 md:py-24 lg:py-28">
      <div className="site-container grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="max-w-xl">
          <p className="text-sm font-medium uppercase text-primary">About Us</p>
          <h2 className="mt-5 text-3xl font-bold text-black sm:text-4xl lg:text-[36px] max-w-[480px]">
            Your Comfort, Safety, and Well-being are at the Heart of Everything we do
          </h2>
          <div className="mt-6 space-y-4 text-sm lg:text-[16px] leading-relaxed text-black sm:text-base max-w-[450px]">
            <p>
              As non-medical caregivers, we work in households, senior homes, or assisted living
              facilities where we run errands, companions, clean, do laundry, and organize as
              requested by the clients or their families.
            </p>
            <p>
              We assist with bathing, brush teeth, dressing, medication reminders, escort to and
              from appointments.
            </p>
          </div>
          <Link
            href="/about"
            className="mt-10 inline-block rounded-sm bg-primary px-7 py-4 text-sm font-bold uppercase text-white transition-colors hover:bg-primary-dark text-[14px]"
          >
            Discover Our Story
          </Link>
        </div>

        <Image
          src="/images/about_img.png"
          alt="Caregiver handing medication to a client and a caregiver serving coffee to a smiling woman"
          width={2268}
          height={1980}
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="h-auto w-full"
        />
      </div>
    </section>
  );
}
