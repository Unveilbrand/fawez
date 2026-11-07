import Image from "next/image";
import Link from "next/link";

const features = [
  { icon: "/images/expert_icon.png", title: "Expert Team", subtitle: "Friendly & Professional", w: 67, h: 60 },
  { icon: "/images/medical_icon.png", title: "Medical Care", subtitle: "Intense Personal Care", w: 70, h: 60 },
  { icon: "/images/support_icon.png", title: "24/7 Support", subtitle: "Friendly & Professional", w: 59, h: 60 },
];

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <Image
        src="/images/hero_bg.png"
        alt="Caregiver smiling with an elderly woman at home"
        fill
        preload
        sizes="100vw"
        className="-z-20 object-cover object-[70%_center]"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-white/90 via-white/60 to-transparent md:from-white/70 md:via-white/20" />

      <div className="site-container pt-14 md:pt-20 lg:pt-24">
        <div className="max-w-xl">
          <h1 className="text-4xl leading-[1.1] text-black sm:text-5xl lg:text-[56px]">
            In A <span className="font-bold">Home Care</span>
            <br />
            That Elevates The
            <br />
            <span className="font-bold">Human Spirit</span>
          </h1>
          <p className="mt-6 max-w-md text-sm leading-snug text-black sm:text-base lg:text-[18px]">
            Experience personalized, reliable in-home care that brings comfort and peace of mind
            to you and your loved ones.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 sm:gap-6">
            <Link
              href="/contact"
              className="rounded-sm border-2 border-primary bg-primary px-6 py-3.5 text-xs font-semibold uppercase text-white transition-colors hover:bg-primary-dark"
            >
              Book An Appointment
            </Link>
            <Link
              href="/services"
              className="rounded-sm border-2 border-primary bg-white/40 px-6 py-3.5 text-xs font-semibold uppercase text-primary backdrop-blur-sm transition-colors hover:bg-primary hover:text-white"
            >
              Explore Services
            </Link>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 overflow-hidden rounded-t-2xl border-2 border-white bg-white/10 backdrop-blur-md sm:grid-cols-3 md:mt-24">
          {features.map(({ icon, title, subtitle, w, h }) => (
            <div
              key={title}
              className="relative flex items-center gap-6 px-8 py-8 not-last:after:absolute not-last:after:inset-x-0 not-last:after:bottom-0 not-last:after:h-1 not-last:after:translate-y-1/2 not-last:after:bg-white/50 sm:not-last:after:inset-x-auto sm:not-last:after:top-5 sm:not-last:after:right-0 sm:not-last:after:h-auto sm:not-last:after:w-1 sm:not-last:after:translate-x-1/2 sm:not-last:after:translate-y-0 lg:px-12 lg:py-10"
            >
              <Image src={icon} alt="" width={w} height={h} className="h-9 w-auto shrink-0 lg:h-10" />
              <div>
                <h3 className="text-base font-bold text-black lg:text-lg">{title}</h3>
                <p className="text-sm text-black">{subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
