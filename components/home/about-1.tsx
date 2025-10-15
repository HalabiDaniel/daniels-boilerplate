'use client';

import { useState } from 'react';

export default function About1() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      label: 'Mission',
      content: 'We are dedicated to creating innovative solutions that empower businesses to thrive in the digital age. Our mission is to deliver exceptional value through cutting-edge technology and unparalleled service.'
    },
    {
      label: 'Vision',
      content: 'To be the leading force in digital transformation, setting new standards for excellence and innovation. We envision a future where technology seamlessly integrates with human potential.'
    },
    {
      label: 'Values',
      content: 'Integrity, innovation, and customer success drive everything we do. We believe in transparency, continuous improvement, and building lasting relationships with our clients and partners.'
    }
  ];

  const counters = [
    { number: '75+', label: 'Custom Components' },
    { number: '20+', label: 'Beautiful Sections' },
    { number: '50+', label: 'Team Members' },
    { number: '10+', label: 'Years Experience' }
  ];

  const getButtonRoundedClass = (index: number) => {
    if (index === 0) return 'rounded-l-lg';
    if (index === tabs.length - 1) return 'rounded-r-lg';
    return '';
  };

  return (
    <section
      className="w-full min-h-[700px] md:min-h-[750px] lg:min-h-[800px] xl:min-h-[850px] flex items-end relative"
      style={{ backgroundColor: 'oklch(0.293 0.066 243.157)' }}
    >
      {/* Hero Image Overlay */}
      <div className="absolute top-0 left-0 right-0 w-full px-4 -translate-y-[40%] z-10">
        <div className="container mx-auto max-w-[1200px]">
          <div className="relative w-full aspect-[16/9] max-h-[500px] overflow-hidden rounded-2xl shadow-2xl">
            <img
              src="/hero-img-3.png"
              alt="Hero image"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16 pt-[320px] md:pt-[360px] space-y-8">
        {/* Pill */}
            <div
              className="inline-block px-3 py-1 rounded-full text-white text-[13px] border-2 border-white"
              style={{
                background: 'oklch(0.5 0.134 242.749)'
              }}
            >
              About the Boilerplate
            </div>
        {/* First Row: Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column: Pill-Title-Subtitle */}
          <div className="space-y-4">
            <h2
              className="font-semibold text-3xl md:text-[42px] md:leading-[50px] text-white"
              style={{
                letterSpacing: '-1px'
              }}
            >
              Making your dream project <span style={{ color: 'oklch(0.685 0.169 237.323)' }}>one step closer</span>
            </h2>
            <p className="text-sm md:text-[15px] md:leading-[26px] font-normal text-white/90 max-w-[500px]">
              Building a project from scratch everytime is tiring, time consuming, and useless. I plan to make my work and yours more efficient, more fun, and way easier.
            </p>
          </div>

          {/* Right Column: Tabs */}
          <div className="space-y-6">
            {/* Tab Headers */}
            <div className="flex w-full">
              {tabs.map((tab, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className={`flex-1 px-6 py-3 text-sm md:text-base font-semibold transition-all ${getButtonRoundedClass(index)}`}
                  style={{
                    backgroundColor: activeTab === index ? 'oklch(0.5 0.134 242.749)' : 'oklch(0.391 0.09 240.876)',
                    color: 'white',
                    letterSpacing: '-0.3px'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="text-white/90 text-sm md:text-[15px] md:leading-[26px]">
              {tabs[activeTab].content}
            </div>
          </div>
        </div>

        {/* Second Row: 4 Counter Columns */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mt-16">
          {counters.map((counter, index) => (
            <div key={index} className="text-center lg:text-left">
              <div
                className="font-bold text-4xl md:text-[56px] md:leading-[64px] text-white mb-2"
                style={{
                  letterSpacing: '-1.5px'
                }}
              >
                {counter.number}
              </div>
              <div className="text-sm md:text-[15px] text-white/80">
                {counter.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
