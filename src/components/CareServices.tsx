import Image from "next/image";

const items = [
  { icon: "/images/adults_icon.svg", title: "We Care For", subtitle: "The Adults", w: 24, h: 24 },
  { icon: "/images/younger_icon.svg", title: "We Care For", subtitle: "The Younger Ones", w: 18, h: 18 },
  { icon: "/images/home_icon.svg", title: "We Work", subtitle: "In Homes", w: 20, h: 18 },
  { icon: "/images/support_icon.svg", title: "24/7", subtitle: "Day Support", w: 24, h: 24 },
];

export default function CareServices() {
  return (
    <section className="relative isolate overflow-hidden">
      <Image
        src="/images/new_services_bg.png"
        alt="Caregiver helping a young girl walk with a pediatric walker"
        fill
        sizes="100vw"
        className="-z-10 object-cover object-center -translate-x-[7%] scale-110"
      />
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(100% 345.98% at 0% 50.05%, rgba(255, 255, 255, 0.75) 0%, rgba(253, 253, 253, 0) 40%, rgba(255, 255, 255, 0) 60%, rgba(255, 255, 255, 0.75) 100%)",
        }}
      />

      <div className="site-container flex flex-col items-center gap-12 py-16 md:py-24 lg:flex-row lg:items-center lg:justify-between lg:py-28">
        <div className="max-w-[400px]">
          <p className="text-sm font-medium uppercase text-primary">Possible Care Services</p>
          <h2 className="mt-5 text-3xl font-bold text-black sm:text-4xl lg:text-[42px]">
            How Do Home Healthcare And Home Care Work Together?
          </h2>
          <p className="mt-6 text-sm font-bold leading-snug text-black lg:text-base lg:text-[20px] max-w-[220px]">
            We cannot change or recommend a therapy.
            We are non medical.
            We follow orders.
          </p>
          <p className="mt-5 text-sm leading-relaxed text-black lg:text-base max-w-[320px]">
            Our well trained caregivers will provide tailored care for you and family members as
            recommended and adhere strictly to our esteem standards for safety and well being of
            our clients.
          </p>
        </div>

        <ul className="w-full max-w-[400px] divide-y-[4px] divide-[#930965]/10 rounded-3xl bg-[#B2DAFFCC] p-6 shadow-[0_3px_30px_#00000040] sm:p-8 lg:mr-4">
          {items.map(({ icon, title, subtitle, w, h }) => (
            <li key={subtitle} className="flex items-center gap-6 py-5 sm:py-6">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.08)]">
                <Image src={icon} alt="" width={w} height={h} />
              </span>
              <div>
                <p className="text-lg font-bold leading-tight text-black lg:text-xl">{title}</p>
                <p className="mt-1 text-sm text-black lg:text-base">{subtitle}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
