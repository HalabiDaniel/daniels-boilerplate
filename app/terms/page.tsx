import PageTitle from "@/components/layouts/page-title";

export default function TermsPage() {
  return (
    <main className="min-h-screen">
      
      <PageTitle
        pillText="Legal"
        pageTitle="Terms and"      
        pageTitleHighlighted="Conditions"      
        description={<>Our Terms and Conditions page outlines the rules, responsibilities, and guidelines for using our website and services.<br/><b>Last updated on:</b> October 18, 2025.</>}
      />  

    </main>
  );
}
