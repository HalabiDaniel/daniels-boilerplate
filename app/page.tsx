import Hero1 from "@/components/home/hero-1"
import Hero2 from "@/components/home/hero-2"
import About1 from "@/components/home/about-1"
import SideBySide from "@/components/home/side-by-side"
import Testimonials from "@/components/home/testimonials"
import Pricing from "@/components/home/pricing"
import HowItWorks from "@/components/home/how-it-works"

export default function Home() {
  return (
    <div>
      <Hero1 />
      <About1 />
      <HowItWorks />
      <SideBySide />
      <Testimonials />
      <Pricing />
    </div>
  );
}
