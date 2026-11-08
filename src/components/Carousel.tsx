"use client";

import { Children, useRef, useState } from "react";

export default function Carousel({
  children,
  className = "",
  gridClassName = "sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8",
  itemLabel = "item",
}: {
  children: React.ReactNode;
  className?: string;
  gridClassName?: string;
  itemLabel?: string;
}) {
  const items = Children.toArray(children);
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  function onScroll() {
    const track = trackRef.current;
    const slide = track?.firstElementChild as HTMLElement | null;
    if (!track || !slide) return;
    const step = slide.offsetWidth + parseFloat(getComputedStyle(track).columnGap || "0");
    setActive(Math.min(items.length - 1, Math.round(track.scrollLeft / step)));
  }

  function goTo(i: number) {
    const slide = trackRef.current?.children[i] as HTMLElement | undefined;
    slide?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }

  return (
    <div className={className}>
      <div
        ref={trackRef}
        onScroll={onScroll}
        className={`-my-4 flex snap-x snap-mandatory gap-4 overflow-x-auto py-4 [scrollbar-width:none] sm:my-0 sm:grid sm:snap-none sm:overflow-visible sm:py-0 [&::-webkit-scrollbar]:hidden ${gridClassName}`}
      >
        {items.map((item, i) => (
          <div key={i} className="w-[85%] shrink-0 snap-center sm:w-auto [&>*]:h-full">
            {item}
          </div>
        ))}
      </div>

      {items.length > 1 && (
        <div className="mt-6 flex justify-center gap-2 sm:hidden">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to ${itemLabel} ${i + 1}`}
              aria-current={active === i}
              className={`h-2 rounded-full transition-all ${
                active === i ? "w-6 bg-primary" : "w-2 bg-primary/25"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
