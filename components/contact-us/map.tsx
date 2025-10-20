import React from 'react';
import { PillBadge } from '@/components/daniels-elements/elements/card-elements';

export default function Map() {
  return (
    <section className="w-full">
      <div className="container mx-auto px-6 md:px-8 lg:px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* Left Column: Info */}
          <div className="space-y-8">
            {/* Pill */}
            <div className="flex justify-start">
              <PillBadge text="Our Address" />
            </div>

            {/* Heading */}
            <h2
              className="font-semibold text-3xl md:text-[42px] md:leading-[50px] text-[oklch(0.145_0_0)] dark:text-white text-left"
              style={{
                letterSpacing: '-1px'
              }}
            >
              Our Location
            </h2>

            {/* Description */}
            <p className="text-sm md:text-[15px] md:leading-[26px] font-normal text-[#404040] dark:text-white/90 text-left">
              Stop by our office or reach out to us during business hours. We'd love to meet you in person.
            </p>

            {/* Address */}
            <div className="space-y-2">
              <p className="text-sm md:text-[15px] font-semibold text-[oklch(0.145_0_0)] dark:text-white">
                Address:
              </p>
              <p className="text-sm md:text-[15px] md:leading-[26px] font-normal text-[#404040] dark:text-white/90">
                123 Wiggly Noodle Drive, Spaghetti Springs, FL 33812
              </p>
            </div>

            {/* Opening Hours */}
            <div className="space-y-2">
              <p className="text-sm md:text-[15px] font-semibold text-[oklch(0.145_0_0)] dark:text-white">
                Opening Hours:
              </p>
              <p className="text-sm md:text-[15px] md:leading-[26px] font-normal text-[#404040] dark:text-white/90">
                08:00 AM - 04:00 PM
              </p>
            </div>
          </div>

          {/* Right Column: Map */}
          <div className="relative min-h-[400px] lg:min-h-[500px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1841!2d-73.9875!3d40.7484!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQ0JzU0LjIiTiA3M8KwNTknMTUuMCJX!5e0!3m2!1sen!2sus!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-2xl absolute inset-0"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
