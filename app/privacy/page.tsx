import PageTitle from "@/components/layouts/page-title";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen">
      
      <PageTitle
        pillText="Legal"
        pageTitle="Privacy"      
        pageTitleHighlighted="Policy"      
        description={<>Our Privacy Policy page explains how we collect, use, and protect your personal information to ensure your data stays safe and secure.<br/><b>Last updated on:</b> October 18, 2025.</>}

      />  
    </main>
  );
}
