import Image from "next/image";
import Link from "next/link";
import Carousel from "@/components/Carousel";

export const services: {
  title: string;
  description: string;
  image: string;
  imageZoom?: boolean;
}[] = [
  {
    title: "Homemaker Services",
    image: "/images/homemaker_img.png",
    description:
      "We provide thoughtful assistance with everyday household tasks, including meal preparation, light housekeeping, and daily chores, helping clients enjoy a clean, comfortable living environment.",
  },
  {
    title: "Laundry & Clothing Care",
    image: "/images/laundry_img.png",
    description:
      "We help with washing, drying, folding, ironing, and organizing clothes, ensuring every client enjoys fresh, clean clothing without the stress of laundry.",
  },
  {
    title: "Elderly Care & Assistance",
    image: "/images/elderly_img.png",
    description:
      "Compassionate daily support for seniors, including assistance with mobility, personal routines, and companionship to promote comfort, dignity, and independence",
  },
  {
    title: "Errand Care",
    image: "/images/errand_img.png",
    description:
      "From grocery shopping and prescription pickups to essential daily errands, we help clients manage their everyday needs with ease and convenience.",
  },
  {
    title: "House Cleaning",
    image: "/images/house_img.png",
    description:
      "Enjoy a cleaner, more comfortable home with assistance in dusting, sweeping, tidying living spaces, and maintaining a safe, organized environment",
  },
  {
    title: "Personal Hygiene Grooming",
    image: "/images/personal_img.png",
    imageZoom: true,
    description:
      "Respectful, hands-on assistance with everyday hygiene routines, including toothbrushing, grooming, dressing, and other personal care activities.",
  },
  {
    title: "Medication Reminder",
    image: "/images/medical_img.png",
    description:
      "We provide timely medication reminders and supportive assistance with daily routines, helping clients follow their prescribed schedules with greater confidence.",
  },
  {
    title: "Dressing Care Service",
    image: "/images/dressing_img.png",
    description:
      "We provide respectful assistance with dressing, changing clothes, and daily grooming routines, helping clients maintain their dignity, comfort, and confidence",
  },
  {
    title: "Bathing Care",
    image: "/images/bathing_img.png",
    description:
      "Respectful, hands-on assistance with everyday hygiene routines, including toothbrushing, grooming, dressing, and other personal care activities.",
  },
  {
    title: "Companions",
    image: "/images/companions_img.png",
    description:
      "We offer meaningful companionship through friendly conversations, engaging activities, and emotional support, helping clients feel valued, connected, and less isolated.",
  },
];

export { stats } from "@/components/ServiceStats";

export default function Services() {
  return (
    <section className="py-16 md:py-24">
      <div className="site-container">
        <div className="flex items-center justify-center gap-6">
          <span className="h-px w-16 bg-gray-300 sm:w-28" />
          <p className="text-sm font-medium uppercase text-primary">Our Services</p>
          <span className="h-px w-16 bg-gray-300 sm:w-28" />
        </div>
        <h2 className="mx-auto mt-6 max-w-[520px] text-center text-3xl font-bold text-black sm:text-4xl lg:text-[36px]">
          Compassionate Support for Every Part of Daily Living
        </h2>

        <Carousel
          className="mx-auto mt-12 max-w-[1100px] lg:mt-16"
          gridClassName="sm:grid-cols-2 sm:gap-x-6 sm:gap-y-[34px] lg:grid-cols-3 lg:gap-x-8 lg:gap-y-[42px] lg:[&>*:last-child]:col-start-2"
          itemLabel="service"
        >
          {services.map(({ title, description, image }) => (
            <article
              key={title}
              className="overflow-hidden rounded-2xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-shadow hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
            >
              <Image
                src={image}
                alt={title}
                width={430}
                height={261}
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="aspect-[430/261] w-full object-cover"
              />
              <div className="px-7 pt-5 pb-7">
                <h3 className="text-lg font-bold text-black lg:text-xl">{title}</h3>
                <p className="mt-2 text-sm leading-snug text-black">{description}</p>
              </div>
            </article>
          ))}
        </Carousel>

        <div className="mt-12 flex justify-center lg:mt-16">
          <Link
            href="/services"
            className="rounded-sm bg-primary px-7 py-4 text-sm font-bold uppercase text-white transition-colors hover:bg-primary-dark"
          >
            Explore Our Care Services
          </Link>
        </div>

      </div>
    </section>
  );
}
