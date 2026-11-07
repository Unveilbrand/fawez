import Image from "next/image";
import Link from "next/link";
import { services } from "@/components/Services";

const cards = [
  {
    icon: "/images/quality_icon.svg",
    title: "Quality Care",
    description:
      "We provide dependable assistance with personal hygiene, dressing, medication reminders, housekeeping, laundry, errands, and daily routines, helping clients feel safe and comfortable.",
    w: 74,
    h: 78,
  },
  {
    icon: "/images/expert_icon.svg",
    title: "Expert Caregivers",
    description:
      "Our dedicated caregivers offer respectful, attentive assistance and meaningful companionship, ensuring every individual feels valued, supported, and genuinely cared for.",
    w: 70,
    h: 75,
  },
  {
    icon: "/images/personalized_icon.svg",
    title: "Personalized Care",
    description:
      "We understand that everyone's needs are different. That's why we tailor our services to each client's preferences, lifestyle, and daily needs while encouraging independence and dignity.",
    w: 75,
    h: 75,
  },
];

export default function AboutMission() {
  return (
    <section className="bg-[#F2F9FF] pt-16 md:pt-24">
      <div className="site-container text-center">
        <p className="text-sm font-medium uppercase text-primary">About Fawez Helping Hands</p>
        <h2 className="mx-auto mt-6 max-w-[640px] text-3xl font-bold text-black sm:text-4xl lg:text-[36px]">
          Because caring goes beyond assistance, it&apos;s about preserving dignity, building
          trust, and making every moment count.
        </h2>
        <p className="mx-auto mt-6 max-w-[600px] text-sm leading-relaxed text-black lg:text-base">
          At Fawez Helping Hands, we provide compassionate, personalized non-medical care that
          makes everyday living easier, promotes independence, and brings comfort, dignity, and
          peace of mind to individuals and their families.
        </p>
        <Link
          href="/about"
          className="mt-8 inline-block rounded-md bg-primary px-6 py-3.5 text-xs font-bold uppercase text-white transition-colors hover:bg-primary-dark"
        >
          Discover Our Story
        </Link>

        <div className="mx-auto mt-14 grid max-w-[1100px] gap-6 text-left sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {cards.map(({ icon, title, description, w, h }) => (
            <article
              key={title}
              className="rounded-2xl bg-white p-8 shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
            >
              <Image src={icon} alt="" width={w} height={h} className="h-14 w-auto" />
              <h3 className="mt-8 text-lg font-bold text-black lg:text-xl">{title}</h3>
              <p className="mt-2 text-sm leading-snug text-black">{description}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="site-container mt-14 overflow-hidden pt-6 pb-16 lg:mt-16 lg:pb-20">
        <div className="flex w-max animate-[marquee_40s_linear_infinite] items-center gap-10">
          {[...services, ...services].map(({ title }, i) => (
            <span key={i} className="flex items-center gap-10 whitespace-nowrap">
              <span className="text-xl font-bold text-black sm:text-2xl lg:text-[28px]">{title}</span>
              <Image src="/images/fawez_icon.svg" alt="" width={40} height={39} className="h-7 w-auto" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
