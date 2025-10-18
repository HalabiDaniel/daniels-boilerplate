'use client';

import { useState } from 'react';

export default function AboutIntro() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      label: 'SaaS-Ready',
      content: 'Built with scalability in mind, this boilerplate comes preconfigured for modern SaaS applications, so you can launch faster with confidence.'
    },
    {
      label: 'Instant Start',
      content: 'Clean architecture, modular code, and intuitive setup make it easy for anyone to get started and customize without friction.'
    },
    {
      label: 'Forever Free',
      content: 'No paywalls and no hidden limits. Use it, build on it, and grow your project without ever worrying about costs.'
    }
  ];

  const counters = [
    { number: '75', label: 'Custom Components' },
    { number: '20', label: 'Beautiful Sections' },
    { number: '50', label: 'Team Members' },
    { number: '10', label: 'Years Experience' }
  ];

  const getButtonRoundedClass = (index: number) => {
    if (index === 0) return 'rounded-l-lg';
    if (index === tabs.length - 1) return 'rounded-r-lg';
    return '';
  };

  return (
    <section
      id="about-intro"
      className="w-full bg-white dark:bg-transparent pt-8 pb-16 md:pt-10 md:pb-20 lg:pt-12 lg:pb-24"
    >
      <div className="container mx-auto px-4 space-y-8">
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
          {/* Left Column: Title-Subtitle */}
          <div className="space-y-4">
            <h2
              className="font-semibold text-3xl md:text-[42px] md:leading-[50px] text-[#262626] dark:text-white"
              style={{
                letterSpacing: '-1px'
              }}
            >
              Making your dream project <span style={{ color: 'oklch(0.5 0.134 242.749)' }}>one step closer</span>
            </h2>
            <p className="text-sm md:text-[15px] md:leading-[26px] font-normal text-[#262626]/90 dark:text-white/90 max-w-[500px]">
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
            <div className="text-[#262626]/90 dark:text-white/90 text-sm md:text-[15px] md:leading-[26px]">
              {tabs[activeTab].content}
            </div>
          </div>
        </div>

        {/* Second Row: 4 Counter Columns */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mt-16">
          {counters.map((counter, index) => (
            <div
              key={index}
              className="text-center rounded-2xl p-6 dark:bg-black"
              style={{
                backgroundColor: 'oklch(0.5 0.134 242.749 / 0.075)'
              }}
            >
              <div
                className="font-bold text-4xl md:text-[56px] md:leading-[64px] mb-2"
                style={{
                  letterSpacing: '-1.5px',
                  color: 'oklch(0.5 0.134 242.749)'
                }}
              >
                {counter.number}<span className="text-2xl md:text-3xl relative top-[-0.35em]">+</span>
              </div>
              <div className="text-sm md:text-[15px] text-[#262626]/80 dark:text-white/80">
                {counter.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
