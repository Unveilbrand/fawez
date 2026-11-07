import Image from "next/image";

export const stats = [
  { value: "25+", label: "Year Experience", icon: "/images/year_icon.svg", w: 18, h: 19 },
  { value: "125+", label: "Care Specialists", icon: "/images/care_icon.svg", w: 19, h: 17 },
  { value: "1,250", label: "Families Served", icon: "/images/families_icon.svg", w: 22, h: 19 },
  { value: "99%", label: "Satisfaction Rate", icon: "/images/satisfaction_icon.svg", w: 20, h: 17 },
];

export default function ServiceStats() {
  return (
    <div className="mt-20 grid items-center gap-10 md:grid-cols-2 lg:mt-28 lg:grid-cols-[1.1fr_1.2fr_0.75fr] lg:gap-12">
      <div className="max-w-sm">
        <p className="text-sm font-medium uppercase text-primary">Our Services</p>
        <h2 className="mt-5 max-w-[290px] text-3xl font-bold text-black sm:text-4xl lg:text-[36px]">
          Senior Care is Not Our Job Its
        </h2>
        <p className="mt-6 max-w-[310px] text-sm leading-snug text-black lg:text-base">
          We provide respectful assistance with dressing, changing clothes, and daily grooming
          routines, helping clients maintain their dignity, comfort, and confidence
        </p>
      </div>

      <Image
        src="/images/services_2_img.png"
        alt="Caregiver holding the hands of an elderly woman"
        width={527}
        height={473}
        sizes="(min-width: 1024px) 35vw, (min-width: 768px) 50vw, 100vw"
        className="h-auto w-full rounded-lg"
      />

      <ul className="space-y-6 rounded-2xl bg-[#F3F8FF] p-6 md:col-span-2 md:grid md:grid-cols-2 md:gap-6 md:space-y-0 lg:col-span-1 lg:block lg:space-y-6">
        {stats.map(({ value, label, icon, w, h }) => (
          <li key={value} className="flex items-center gap-5">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.08)]">
              <Image src={icon} alt="" width={w} height={h} />
            </span>
            <div>
              <p className="text-lg font-bold leading-tight text-black">{value}</p>
              <p className="text-sm text-black">{label}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
