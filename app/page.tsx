import Hero1 from "@/components/home/hero-1"
import Hero2 from "@/components/home/hero-2"
import About1 from "@/components/home/about-1"
import SideBySide from "@/components/home/side-by-side"
import Testimonials from "@/components/home/testimonials"

export default function Home() {
  return (
    <div>
      <Hero1 />
      <About1 />
      <SideBySide />
      <Testimonials />
    </div>
  );
}