import Image, { getImageProps } from "next/image";
import Link from "next/link";

const features = [
  { icon: "/images/expert_icon.png", title: "Expert Team", subtitle: "Friendly & Professional", w: 67, h: 60 },
  { icon: "/images/medical_icon.png", title: "Medication Reminder", subtitle: "Intense Personal Care", w: 70, h: 60 },
  { icon: "/images/support_icon.png", title: "24/7 Support", subtitle: "Friendly & Professional", w: 59, h: 60 },
];

export default function Hero() {
  const common = { alt: "Caregiver smiling with an elderly woman at home", fill: true, sizes: "100vw" };
  const {
    props: { srcSet: desktop },
  } = getImageProps({ ...common, src: "/images/hero_bg.png" });
  const {
    props: { srcSet: mobile, ...rest },
  } = getImageProps({ ...common, src: "/images/hero_banner_bg.png" });

  return (
    <section className="relative isolate overflow-hidden">
      <picture>
        <source media="(min-width: 640px)" srcSet={desktop} />
        <source srcSet={mobile} />
        <img
          {...rest}
          alt={common.alt}
          fetchPriority="high"
          className="-z-20 object-cover object-top sm:object-[70%_center]"
        />
      </picture>
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white/85 via-white/40 to-transparent sm:bg-gradient-to-r sm:from-white/90 sm:via-white/60 md:from-white/70 md:via-white/20" />

      <div className="site-container pt-14 md:pt-20 lg:pt-24">
        <div className="max-w-xl">
          <h1 className="text-4xl leading-[1.1] text-black sm:text-5xl lg:text-[56px]">
            In-Home <span className="font-bold">Care</span>
            <br />
            That <span className="font-bold">Elevates</span> The
            <br />
            <span className="font-bold">Human</span> Spirit
          </h1>
          <p className="mt-6 max-w-md text-sm leading-snug text-black sm:text-base lg:text-[18px]">
            Experience personalized, reliable in-home care that brings comfort and peace of mind
            to you and your loved ones.
          </p>
          <div className="mt-8 flex flex-col items-start gap-5 sm:mt-6 sm:flex-row sm:flex-wrap sm:gap-6">
            <Link
              href="/contact"
              className="rounded-sm border-2 border-primary bg-primary px-7 py-4 text-sm font-bold uppercase text-white transition-colors hover:bg-primary-dark sm:px-6 sm:py-3.5 sm:text-xs sm:font-semibold"
            >
              Book An Appointment
            </Link>
            <Link
              href="/services"
              className="rounded-sm border-2 border-primary bg-white/40 px-7 py-4 text-sm font-bold uppercase text-primary backdrop-blur-sm transition-colors hover:bg-primary hover:text-white sm:px-6 sm:py-3.5 sm:text-xs sm:font-semibold"
            >
              Explore Services
            </Link>
          </div>
        </div>

        <div className="mt-28 grid grid-cols-3 overflow-hidden rounded-t-2xl border-2 border-white bg-white/10 backdrop-blur-md sm:mt-16 md:mt-24">
          {features.map(({ icon, title, subtitle, w, h }) => (
            <div
              key={title}
              className="relative flex flex-col items-center justify-center gap-3 px-2 py-6 text-center not-last:after:absolute not-last:after:top-5 not-last:after:bottom-0 not-last:after:right-0 not-last:after:w-1 not-last:after:translate-x-1/2 not-last:after:bg-white/50 sm:flex-row sm:justify-start sm:gap-6 sm:px-8 sm:py-4 sm:text-left lg:px-12 lg:py-10"
            >
              <Image src={icon} alt="" width={w} height={h} className="h-9 w-auto shrink-0 lg:h-10" />
              <div>
                <h3 className="text-sm font-bold leading-tight text-black sm:text-base lg:text-lg">{title}</h3>
                <p className="hidden text-sm text-black sm:block">{subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
