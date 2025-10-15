import Image from 'next/image';

export default function Hero2() {
  return (
    <>
      <section
        className="w-full min-h-screen bg-[#F4F7F3] dark:bg-neutral-900 relative pb-16"
      >
        <div className="container mx-auto px-4 py-16">
          {/* Content wrapper with left alignment */}
          <div className="w-full max-w-[1200px] mx-auto flex flex-col md:flex-row md:items-start md:justify-between gap-8">
            {/* Left side - Text content */}
            <div className="flex flex-col items-start text-left space-y-6 max-w-[720px]">
              {/* Pill */}
              <div
                className="px-3 py-1 rounded-full text-white text-[13px] border-2 border-white"
                style={{
                  background: 'linear-gradient(to right, oklch(0.5 0.134 242.749), oklch(0.293 0.066 243.157), black)'
                }}
              >
                v1.0 available for free
              </div>

              {/* H1 */}
              <h1
                className="font-semibold text-3xl md:text-[52px] md:leading-[62px] text-[oklch(0.145_0_0)] dark:text-white"
                style={{
                  letterSpacing: '-1.35px'
                }}
              >
                Your Friendly Neighborhood <span style={{ color: 'oklch(0.5 0.134 242.749)' }}>Boilerplate</span>
              </h1>

              {/* P */}
              <p className="text-base md:text-[16px] md:leading-[28px] font-normal text-[#404040] dark:text-white max-w-[600px]">
                A personal boilerplate created by Daniel Halabi to facilitate building Next.js websites quickly and efficiently.
              </p>
            </div>

            {/* Right side - Image */}
            <div className="relative w-full md:w-[400px] h-[300px]">
              <Image
                src="/hero-img-2.png"
                alt="Hero secondary image"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Image wrapper - positioned to overflow the hero section */}
      <div className="w-full px-4 -mt-80 relative z-10">
        <div className="container mx-auto max-w-[1200px]">
          <div className="relative w-full aspect-[16/9] max-h-[500px] overflow-hidden rounded-2xl shadow-2xl">
            <Image
              src="/hero-img.png"
              alt="Hero image"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </>
  );
}
