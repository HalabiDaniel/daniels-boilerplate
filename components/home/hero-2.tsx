import Image from 'next/image';
import { PillBadge } from '@/components/daniels-elements/elements/card-elements';
import { HighlightedText } from '@/components/daniels-elements/elements/highlighted-text';

export default function Hero2() {
  return (
    <section
      className="w-full min-h-[500px] md:min-h-[550px] lg:min-h-[600px] xl:min-h-[650px] bg-[#F4F7F3] dark:bg-neutral-900 relative pb-16"
    >
      <div className="container mx-auto px-4 py-16">
        {/* Content wrapper with left alignment */}
        <div className="w-full max-w-[1200px] mx-auto flex flex-col md:flex-row md:items-start md:justify-between gap-8">
          {/* Left side - Text content */}
          <div className="flex flex-col items-start text-left space-y-6 max-w-[720px]">
            {/* Pill */}
            <PillBadge />

            {/* H1 */}
            <h1
              className="font-semibold text-3xl md:text-[52px] md:leading-[62px] text-[oklch(0.145_0_0)] dark:text-white"
              style={{
                letterSpacing: '-1.35px'
              }}
            >
              Your Friendly Neighborhood Next.js <HighlightedText>Boilerplate</HighlightedText>
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
  );
}
