"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  { target: 72, format: (n: number) => `${n}`, suffix: "+", label: "Programs & Trainings" },
  { target: 10, format: (n: number) => `${n}`, suffix: "+", label: "Daily Customers" },
  { target: 20, format: (n: number) => `${n}`, suffix: "+", label: "Work Sessions" },
  {
    target: 1000,
    format: (n: number) => (n >= 1000 ? `${Math.floor(n / 1000)}K` : `${n}`),
    suffix: "+",
    label: "Happy Customers",
  },
];

const DURATION = 1800;

function Stat({ target, format, suffix, label, started }: {
  target: number;
  format: (n: number) => string;
  suffix: string;
  label: string;
  started: boolean;
}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!started) return;
    let raf: number;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min((t - t0) / DURATION, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, target]);

  return (
    <div className="flex flex-col items-center px-4 py-8 text-center sm:px-6 lg:py-10">
      <p className="text-4xl font-normal sm:text-5xl lg:text-[52px]">
        {format(value)}
        {suffix}
      </p>
      <p className="mt-2 text-sm font-medium text-white/90">{label}</p>
    </div>
  );
}

export default function AboutStats() {
  const ref = useRef<HTMLElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="bg-primary-dark py-16 text-white md:py-20">
      <div className="site-container">
        <h2 className="mx-auto max-w-[520px] text-center text-3xl font-bold sm:text-4xl lg:text-[36px]">
          Trusted And Backed By Meaningful Results
        </h2>
        <dl className="mx-auto mt-12 grid max-w-[1100px] grid-cols-2 divide-x divide-white/25 border border-white/25 lg:grid-cols-4">
          {stats.map(({ target, format, suffix, label }) => (
            <Stat
              key={label}
              target={target}
              format={format}
              suffix={suffix}
              label={label}
              started={started}
            />
          ))}
        </dl>
      </div>
    </section>
  );
}
