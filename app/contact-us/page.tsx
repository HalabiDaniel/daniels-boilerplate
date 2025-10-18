import Actions from "@/components/contact-us/actions";
import ContactForm from "@/components/contact-us/form";
import Map from "@/components/contact-us/map";
import PageTitle from "@/components/layouts/page-title";

export default function ContactUsPage() {
  return (
    <main className="min-h-screen">

      <PageTitle
        pillText="Contact Us"
        pageTitle="Send Us a Friendly"
        pageTitleHighlighted="Message"
        description="Feel free to reach out to us using the options below, and our dedicated team will respond to your inquiries promptly."
      />

      <ContactForm />
      <Actions />
      <Map />

    </main>
  );
}
