'use client';

import Image from 'next/image';

const testimonials = [
  {
    quote: "The A/B testing helped us refine our email campaigns, resulting in a huge increase in open rates.",
    name: "Frederic Hill",
    position: "Founder & CEO",
    image: "/testimonials.png",
    metric: "+ 120 %",
    metricLabel: "Increase in ad awareness in the first month"
  },
  {
    quote: "Our social media engagement soared within the first month of using this software.",
    name: "Safaa Sampson",
    position: "Account Executive",
    image: "/testimonials.png",
    metric: "+ 10 k",
    metricLabel: "New followers in the last 4 months"
  },
  {
    quote: "This software allowed us to increase our lead generation, leading to a rise in conversions.",
    name: "Brendan Buck",
    position: "Marketing Manager",
    image: "/testimonials.png",
    metric: "+ 50 %",
    metricLabel: "Increase in paid bookings vs last year"
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
            Hear from our satisfied customers
          </h2>

          {/* Text */}
          <p className="text-sm md:text-[15px] md:leading-[26px] font-normal text-white/90 max-w-[600px]">
            The best way to showcase our commitment is through the experiences and stories of those who have partnered with us.
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
