'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PillBadge } from '@/components/daniels-elements/elements/card-elements';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section className="w-full -mt-16 md:-mt-20 relative z-10">
      <div className="container mx-auto px-6 md:px-8 lg:px-4 py-8 md:py-12">
        <div className="rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 border border-gray-200 dark:border-gray-800">
          {/* Left Column: Form */}
          <div className="p-8 md:p-12 space-y-6" style={{ background: 'oklch(0.5 0.134 242.749)' }}>
            {/* Pill */}
            <div className="flex justify-start">
              <PillBadge text="Contact Form" />
            </div>

            {/* Heading */}
            <h2
              className="font-semibold text-3xl md:text-[42px] md:leading-[50px] text-white text-left"
              style={{
                letterSpacing: '-1px'
              }}
            >
              Get in touch
            </h2>

            {/* Description */}
            <p className="text-sm md:text-[15px] md:leading-[26px] font-normal text-white/90 text-left">
              Have a question or want to work together? Fill out the form below and we'll get back to you as soon as possible.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3.5 text-sm rounded-lg bg-white dark:bg-white/20 text-[#262626] dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/70 outline-none border-0 focus:ring-0"
              />

              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3.5 text-sm rounded-lg bg-white dark:bg-white/20 text-[#262626] dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/70 outline-none border-0 focus:ring-0"
              />

              <textarea
                id="message"
                name="message"
                placeholder="Message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-3.5 text-sm rounded-lg bg-white dark:bg-white/20 text-[#262626] dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/70 outline-none border-0 focus:ring-0 resize-none"
              />

              <Button type="submit" className="bg-[#262626] hover:bg-white text-white hover:text-[#262626] transition-colors duration-300 w-full md:w-auto">
                Send Message
              </Button>
            </form>
          </div>

          {/* Right Column: Image with Quote */}
          <div className="relative min-h-[400px] lg:min-h-[600px]">
            <Image
              src="https://res.cloudinary.com/dbactyzwl/image/upload/v1760818881/Untitled_design_3_gmk9c3.png"
              alt="Contact"
              fill
              className="object-cover"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" />
            
            {/* Quote Content */}
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 space-y-2">
              <p className="text-sm md:text-[15px] md:leading-[26px] font-normal text-white">
                "Working with this team has been an absolute pleasure. Their attention to detail and commitment to excellence is unmatched."
              </p>
              <p className="text-xs md:text-sm font-semibold text-white">
                Sarah Johnson
              </p>
              <p className="text-[11px] md:text-xs font-light text-white/80">
                CEO, Tech Innovations
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
