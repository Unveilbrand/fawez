import Image from "next/image";

export default function PageBanner({
  title,
  subtitle,
  image,
  alt,
  position = "object-center",
}: {
  title: string;
  subtitle: string;
  image: string;
  alt: string;
  position?: string;
}) {
  return (
    <section className="relative isolate h-[460px] overflow-hidden md:h-[520px]">
      <Image
        src={image}
        alt={alt}
        fill
        preload
        sizes="100vw"
        className={`-z-10 object-cover ${position}`}
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,#930965_0%,#930965_15%,#930965B3_35%,#93096559_55%,transparent_75%)]" />
      <div className="absolute inset-x-0 bottom-12">
        <div className="site-container flex flex-col gap-4 text-white sm:flex-row sm:items-end sm:justify-between">
          <h1 className="text-4xl font-bold sm:text-5xl">{title}</h1>
          <p className="max-w-[320px] text-sm leading-snug sm:text-right">{subtitle}</p>
        </div>
      </div>
    </section>
  );
}
