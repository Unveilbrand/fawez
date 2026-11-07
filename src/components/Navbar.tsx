"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Blogs", href: "/blogs" },
  { label: "Contact Us", href: "/contact" },
];

const socials = [
  { label: "Facebook", href: "#", icon: "/images/facebook_icon.svg" },
  { label: "Twitter", href: "#", icon: "/images/twitter_icon.svg" },
  { label: "Instagram", href: "#", icon: "/images/instagram_icon.svg" },
];

function ContactItem({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-primary/25">
        <Image src={icon} alt="" width={20} height={20} />
      </span>
      <div className="text-sm leading-snug uppercase text-black">
        <p>{title}</p>
        <p className="font-bold">{children}</p>
      </div>
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [stuck, setStuck] = useState(false);
  const [linksOffset, setLinksOffset] = useState(0);
  const navRef = useRef<HTMLElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const nav = navRef.current;
      if (!nav) return;
      // offsetTop stays constant while the nav is in the document flow
      if (window.scrollY === 0) setStuck(false);
      else if (window.scrollY >= nav.offsetTop) setStuck(true);
    };
    const measure = () => {
      const row = rowRef.current;
      const links = linksRef.current;
      if (row && links) {
        setLinksOffset(row.clientWidth / 2 - links.offsetLeft - links.offsetWidth / 2);
      }
    };
    const onScrollAndResize = () => {
      onScroll();
      measure();
    };
    onScrollAndResize();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScrollAndResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScrollAndResize);
    };
  }, []);

  const menuButton = (
    <button
      type="button"
      onClick={() => setOpen((o) => !o)}
      aria-label="Toggle menu"
      aria-expanded={open}
      className="flex size-10 items-center justify-center rounded-md border border-gray-200 text-primary md:hidden"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
      </svg>
    </button>
  );

  const linksList = (
    <ul
      ref={linksRef}
      style={{ transform: `translateX(${stuck ? linksOffset : 0}px)` }}
      className="-ml-2.5 flex items-center gap-4 transition-transform duration-300 ease-out lg:gap-9"
    >
      {navLinks.map(({ label, href }) => {
        const active = pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
        return (
          <li key={href}>
            <Link
              href={href}
              className={`relative block px-2.5 py-4 text-sm uppercase transition-colors after:absolute after:inset-x-0 after:bottom-1 after:h-0.5 after:bg-primary after:transition-transform ${
                active
                  ? "font-semibold text-primary after:scale-x-100"
                  : "text-black after:scale-x-0 hover:text-primary"
              }`}
            >
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  const socialsBlock = (
    <div className="flex items-center gap-6 border-l border-gray-200 pl-5">
      <span className="text-sm uppercase text-black">Follow Us</span>
      <div className="flex items-center gap-4">
        {socials.map(({ label, href, icon }) => (
          <a key={label} href={href} aria-label={label} className="transition-opacity hover:opacity-70">
            <Image src={icon} alt="" width={14} height={14} />
          </a>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <header className="sticky top-0 z-50 bg-white md:static">
        <div className="site-container flex items-center justify-between gap-6 py-3">
          <Link href="/" aria-label="Fawez home">
            <Image
              src="/images/fawez_logo.png"
              alt="Fawez - Helping Hands"
              width={255}
              height={71}
              preload
              className="h-10 w-auto sm:h-12"
            />
          </Link>

          <div className="hidden items-center gap-8 lg:flex">
            <ContactItem icon="/images/location_icon.svg" title="5875 N Lincoln Avenue STE 110">
              Chicago IL, 60659
            </ContactItem>
            <ContactItem icon="/images/phone_icon.svg" title="Call Us:">
              (847)-600-1096, (773)-544-3775
            </ContactItem>
            <Link
              href="/login"
              className="ml-6 rounded-md bg-primary px-7 py-4 text-sm font-bold uppercase text-white transition-colors hover:bg-primary-dark"
            >
              Login
            </Link>
          </div>

          {menuButton}
        </div>

        {open && (
          <div className="site-container space-y-5 border-t border-gray-200 py-4 md:hidden">
            <ul className="space-y-1">
              {navLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setOpen(false)}
                    className={`block py-2 text-sm font-medium uppercase ${
                      pathname === href || (href !== "/" && pathname.startsWith(`${href}/`))
                        ? "text-primary"
                        : "text-black"
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="space-y-4 border-t border-gray-200 pt-4">
              <ContactItem icon="/images/location_icon.svg" title="5875 N Lincoln Avenue STE 110">
                Chicago IL, 60659
              </ContactItem>
              <ContactItem icon="/images/phone_icon.svg" title="Call Us:">
                (847)-600-1096, (773)-544-3775
              </ContactItem>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {socials.map(({ label, href, icon }) => (
                  <a key={label} href={href} aria-label={label}>
                    <Image src={icon} alt="" width={16} height={16} />
                  </a>
                ))}
              </div>
              <Link
                href="/login"
                className="rounded-md bg-primary px-6 py-3 text-sm font-bold uppercase text-white"
              >
                Login
              </Link>
            </div>
          </div>
        )}
      </header>

      <nav
        ref={navRef}
        className={`z-50 bg-white transition-shadow md:sticky md:top-0 ${
          stuck ? "shadow-[0_4px_20px_rgba(0,0,0,0.08)]" : ""
        }`}
      >
        <div className="site-container">
          <div
            ref={rowRef}
            className="relative hidden items-center justify-between border-t border-gray-200 md:flex"
          >
            <Link
              href="/"
              aria-label="Fawez home"
              aria-hidden={!stuck}
              className={`absolute left-0 flex items-center transition-opacity duration-300 ${
                stuck ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              <Image
                src="/images/fawez_logo.png"
                alt="Fawez - Helping Hands"
                width={255}
                height={71}
                className="h-9 w-auto"
              />
            </Link>
            {linksList}
            {socialsBlock}
          </div>
        </div>
      </nav>
    </>
  );
}
