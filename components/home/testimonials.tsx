'use client';

import Image from 'next/image';

const testimonials = [
  {
    quote: "I used to spend hours hunting down tiny bugs. Now I just point at this template and poof, the problem solved before I even finish my coffee.",
    name: "Alex Morgan",
    position: "Freelance Developer",
    image: "/testimonials.png",
    metric: "40+",
    metricLabel: "hours saved on coding in the first day."
  },
  {
    quote: "I showed this template to my team, and they actually cheered. I have not seen humans react that way since free pizza day.",
    name: "Jamie Lin",
    position: "Startup CTO",
    image: "/testimonials.png",
    metric: "$10,000",
    metricLabel: "saved on developer costs"
  },
  {
    quote: "I dragged, I dropped, and suddenly my landing page looks like it was built by a designer who drinks coffee with unicorns.",
    name: "Sam Patel",
    position: "UI/UX Designer",
    image: "/testimonials.png",
    metric: "50+",
    metricLabel: "hours saved of hair-pulling frustration."
  }
];

export default function Testimonials() {
  return (
    <section
      className="w-full py-16 md:py-24"
      style={{
        backgroundColor: 'oklch(0.293 0.066 243.157)'
      }}
    >
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center space-y-6 mb-16">
          {/* Pill */}
          <div
            className="px-3 py-1 rounded-full text-white text-[13px] border-2 border-white"
            style={{
              background: 'oklch(0.5 0.134 242.749)'
            }}
          >
            Customer Testimonials
          </div>

          {/* Heading */}
          <h2
            className="font-semibold text-3xl md:text-[42px] md:leading-[50px] text-white"
            style={{
              letterSpacing: '-1px'
            }}
          >
            Hear from my satisfied users
          </h2>

          {/* Text */}
          <p className="text-sm md:text-[15px] md:leading-[26px] font-normal text-white/90 max-w-[600px]">
            Alright, you caught me… these are not real users. But hey, this is your future testimonial section, so go ahead and enjoy it because it is already built for you!
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="rounded-2xl p-6 space-y-6"
              style={{
                backgroundColor: 'oklch(0.5 0.134 242.749 / 0.5)'
              }}
            >
              {/* Quote */}
              <p className="text-white text-base md:text-[16px] leading-relaxed">
                {testimonial.quote}
              </p>

              {/* Person Info */}
              <div className="flex items-center gap-3">
                {/* Photo Circle */}
                <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Name and Position */}
                <div>
                  <p className="text-white font-semibold text-sm">
                    {testimonial.name}
                  </p>
                  <p className="text-white/70 text-xs">
                    {testimonial.position}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-white/20" />

              {/* Metric Section */}
              <div>
                <p className="text-white font-bold text-2xl md:text-3xl mb-1">
                  {testimonial.metric}
                </p>
                <p className="text-white/70 text-xs">
                  {testimonial.metricLabel}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
