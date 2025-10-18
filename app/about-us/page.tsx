import PageTitle from "@/components/layouts/page-title";
import AboutIntro from "@/components/about-us/about-intro";
import AboutTeam from "@/components/about-us/about-team";
import AboutFaqs from "@/components/about-us/about-faqs";
import AboutInfo from "@/components/about-us/about-info";

export default function AboutUsPage() {
  return (
    <main className="min-h-screen">

      <PageTitle
        pillText="About Us"
        pageTitle="Get to Know Daniel's"
        pageTitleHighlighted="Boilerplate"
        description="A personal boilerplate created by Daniel Halabi to facilitate building Next.js websites quickly and efficiently."
      />

      <AboutIntro />

      <AboutInfo />

      <AboutTeam />

      <AboutFaqs />

    </main>
  );
}
