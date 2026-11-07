import Image from "next/image";
import Link from "next/link";

const columns = [
  {
    title: "Navigations",
    links: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Courses", href: "#" },
      { label: "Products", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Applications", href: "#" },
      { label: "Products", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms & Conditions", href: "#" },
      { label: "Products", href: "#" },
      { label: "Certifications", href: "#" },
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
              Start With the Free Forex Sniper Class, learn the exact framework we use before
              risking capital.
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

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:gap-20">
            {columns.map(({ title, links }) => (
              <nav key={title} aria-label={title}>
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
