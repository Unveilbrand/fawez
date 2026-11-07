"use client";

import Image from "next/image";
import { useState } from "react";

const testimonials = [
  {
    name: "Fatima Al-Hassan",
    role: "Event planner",
    image: "/images/testimonial_img.jpg",
    rating: 5,
    quote:
      "Fawez Helping Hands has made a huge difference in my aunt’s life. The support, patience and compassion are second to none. The caregivers are wonderful and treat my aunt with so much kindness and respect. It gives me peace of mind.",
  },
  {
    name: "Fatima Al-Hassan",
    role: "Event planner",
    image: "/images/testimonial_img.jpg",
    rating: 5,
    quote:
      "Fawez Helping Hands has made a huge difference in my aunt’s life. The support, patience and compassion are second to none. The caregivers are wonderful and treat my aunt with so much kindness and respect. It gives me peace of mind.",
  },
  {
    name: "Fatima Al-Hassan",
    role: "Event planner",
    image: "/images/testimonial_img.jpg",
    rating: 5,
    quote:
      "Fawez Helping Hands has made a huge difference in my aunt’s life. The support, patience and compassion are second to none. The caregivers are wonderful and treat my aunt with so much kindness and respect. It gives me peace of mind.",
  },
  {
    name: "Fatima Al-Hassan",
    role: "Event planner",
    image: "/images/testimonial_img.jpg",
    rating: 5,
    quote:
      "Fawez Helping Hands has made a huge difference in my aunt’s life. The support, patience and compassion are second to none. The caregivers are wonderful and treat my aunt with so much kindness and respect. It gives me peace of mind.",
  },
  {
    name: "Fatima Al-Hassan",
    role: "Event planner",
    image: "/images/testimonial_img.jpg",
    rating: 5,
    quote:
      "Fawez Helping Hands has made a huge difference in my aunt’s life. The support, patience and compassion are second to none. The caregivers are wonderful and treat my aunt with so much kindness and respect. It gives me peace of mind.",
  },
];

const navButton =
  "flex size-11 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition-colors hover:bg-primary-dark hover:text-white";

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d={direction === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} />
    </svg>
  );
}

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const count = testimonials.length;
  const go = (i: number) => setActive((i + count) % count);

  return (
    <section className="relative isolate overflow-hidden py-16 md:py-24">
      <Image
        src="/images/testimonial_bg.png"
        alt=""
        fill
        sizes="100vw"
        className="-z-10 object-cover"
      />

      <div className="site-container">
        <p className="text-center text-sm font-medium uppercase text-white">What People Say</p>
        <h2 className="mt-4 text-center text-3xl font-bold text-white sm:text-4xl lg:text-[36px]">
          Customer Testimonials
        </h2>

        <div className="mx-auto mt-10 max-w-[720px] rounded-3xl bg-white px-6 py-8 sm:px-11 sm:py-11 lg:mt-12">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${active * 100}%)` }}
            >
              {testimonials.map(({ name, role, image, rating, quote }, i) => (
                <figure key={i} className="w-full shrink-0" aria-hidden={i !== active}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="mt-6 flex gap-1" aria-label={`${rating} out of 5 stars`}>
                      {Array.from({ length: rating }, (_, s) => (
                        <Image key={s} src="/images/start_icon.png" alt="" width={20} height={20} />
                      ))}
                    </div>
                    <Image
                      src="/images/quotes_icon.svg"
                      alt=""
                      width={64}
                      height={64}
                      className="size-12 sm:size-16"
                    />
                  </div>
                  <blockquote className="mt-2 text-base leading-snug text-black sm:text-lg lg:text-xl">
                    “{quote}”
                  </blockquote>
                  <figcaption className="mt-8 flex items-center gap-4">
                    <Image
                      src={image}
                      alt={name}
                      width={612}
                      height={408}
                      sizes="56px"
                      className="size-14 rounded-full border border-primary object-cover"
                    />
                    <div>
                      <p className="text-lg font-semibold text-black">{name}</p>
                      <p className="text-sm font-medium text-primary">{role}</p>
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>

          <div className="mt-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  aria-current={i === active}
                  className={`h-2 rounded-full transition-all ${
                    i === active ? "w-8 bg-primary-dark" : "w-2 bg-gray-200 hover:bg-gray-300"
                  }`}
                />
              ))}
            </div>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => go(active - 1)}
                aria-label="Previous testimonial"
                className={navButton}
              >
                <Chevron direction="left" />
              </button>
              <button
                type="button"
                onClick={() => go(active + 1)}
                aria-label="Next testimonial"
                className={navButton}
              >
                <Chevron direction="right" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
