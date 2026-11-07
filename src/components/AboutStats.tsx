const stats = [
  { value: "72+", label: "Programs & Trainings" },
  { value: "10+", label: "Daily Customers" },
  { value: "20+", label: "Work Sessions" },
  { value: "1K+", label: "Happy Customers" },
];

export default function AboutStats() {
  return (
    <section className="bg-primary-dark py-16 text-white md:py-20">
      <div className="site-container">
        <h2 className="mx-auto max-w-[520px] text-center text-3xl font-bold sm:text-4xl lg:text-[36px]">
          Trusted And Backed By Meaningful Results
        </h2>
        <dl className="mx-auto mt-12 grid max-w-[1100px] grid-cols-2 divide-x divide-white/25 border border-white/25 lg:grid-cols-4">
          {stats.map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center px-4 py-8 text-center sm:px-6 lg:py-10">
              <p className="text-4xl font-normal sm:text-5xl lg:text-[52px]">{value}</p>
              <p className="mt-2 text-sm font-medium text-white/90">{label}</p>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
