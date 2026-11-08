import Image from "next/image";
import Link from "next/link";

const columns = [
  {
    title: "More Links",
    links: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Contact us", href: "/contact" },
      { label: "Blogs", href: "/blogs" },
    ],
  },
  {
    title: "What We Do",
    links: [
      { label: "House Cleaning", href: "/services" },
      { label: "Medication Reminder", href: "/services" },
      { label: "Errand Care", href: "/services" },
      { label: "Companions", href: "/services" },
    ],
  },
  {
    title: "What We Do",
    links: [
      { label: "Laundry & Clothing Care", href: "/services" },
      { label: "Elderly Care & Assistance", href: "/services" },
      { label: "Dressing Care Service", href: "/services" },
      { label: "Personal Hygiene Grooming", href: "/services" },
    ],
  },
];

const socials = [
  { label: "Facebook", href: "#", icon: "/images/footer_fb_icon.svg", w: 22, h: 22 },
  { label: "Telegram", href: "#", icon: "/images/footer_tg_icon.svg", w: 18, h: 16 },
  { label: "Instagram", href: "#", icon: "/images/footer_ig_icon.svg", w: 20, h: 20 },
  { label: "TikTok", href: "#", icon: "/images/footer_tt_icon.svg", w: 17, h: 20 },
  { label: "YouTube", href: "#", icon: "/images/footer_yt_icon.svg", w: 23, h: 16 },
];

export default function Footer() {
  return (
    <footer>
      <div className="bg-primary-dark py-12 text-white md:py-16">
        <div className="site-container flex flex-col gap-12 lg:flex-row lg:justify-between">
          <div className="max-w-md">
            <Link href="/" aria-label="Fawez home">
              <Image
                src="/images/footer_logo.png"
                alt="Fawez - Helping Hands"
                width={315}
                height={91}
                className="h-14 w-auto sm:h-16"
              />
            </Link>
            <p className="mt-5 text-base leading-snug">
              In-home care that elevates the human spirit bringing comfort, dignity, and
              peace of mind to you and your loved ones.
            </p>
            <div className="mt-6 flex items-center gap-5">
              <span className="text-sm font-semibold">Connect with us:</span>
              <div className="flex items-center gap-4">
                {socials.map(({ label, href, icon, w, h }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="transition-opacity hover:opacity-70"
                  >
                    <Image src={icon} alt="" width={w} height={h} className="h-4 w-auto" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-14 gap-y-10 lg:gap-x-24">
            {columns.map(({ title, links }, i) => (
              <nav key={`${title}-${i}`} aria-label={`${title} ${i + 1}`} className="shrink-0">
                <h3 className="text-sm font-semibold">{title}</h3>
                <ul className="mt-5 space-y-3.5">
                  {links.map(({ label, href }) => (
                    <li key={label}>
                      <Link
                        href={href}
                        className="text-sm text-white/90 transition-colors hover:text-white"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#B5DAFF] py-2.5">
        <p className="site-container text-sm text-black">© 2026 Copyright Reserved by Fawez Helping Hands</p>
      </div>
    </footer>
  );
}
