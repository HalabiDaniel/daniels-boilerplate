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

      <section className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="prose max-w-none">
          <p>Welcome to [Your Website Name]. By accessing or using this website, you agree to comply with and be bound by these Terms and Conditions. Please read them carefully before using our services.</p>
          
          <h4>1. Acceptance of Terms</h4>
          <p>By registering for an account or using this website, you agree to these Terms and Conditions and our Privacy Policy. If you do not agree, please discontinue using the website immediately.</p>
          
          <h4>2. Use of the Website</h4>
          <p>You agree to use this website only for lawful purposes and in a manner that does not violate the rights of others or restrict their use of the site. You must not:</p>
          <ul>
            <li>Use the website to engage in any fraudulent or illegal activity</li>
            <li>Attempt to gain unauthorized access to our systems or other user accounts</li>
            <li>Upload or transmit harmful code, malware, or spam</li>
          </ul>
          
          <h4>3. Account Registration</h4>
          <p>When you create an account, you must provide accurate and complete information, including your full name, email address, and password. You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.</p>
          <p>We reserve the right to suspend or delete accounts that violate these Terms or appear to be fraudulent.</p>
          
          <h4>4. Intellectual Property</h4>
          <p>All content, trademarks, designs, and materials available on this website are the property of [Your Website Name] or its licensors. You may not copy, distribute, modify, or use any content without prior written permission.</p>
          
          <h4>5. Limitation of Liability</h4>
          <p>To the maximum extent permitted by law, [Your Website Name] shall not be liable for any direct, indirect, incidental, or consequential damages resulting from your use of or inability to use the website, including data loss, unauthorized access, or service interruptions.</p>
          
          <h4>6. Termination</h4>
          <p>We reserve the right to suspend or terminate your account at any time, with or without notice, if we believe you have violated these Terms or engaged in behavior harmful to other users or the website.</p>
          
          <h4>7. Third-Party Links</h4>
          <p>Our website may contain links to third-party websites. We are not responsible for the content, policies, or practices of these external sites. Accessing them is at your own risk.</p>
          
          <h4>8. Modifications to the Terms</h4>
          <p>We may update or modify these Terms and Conditions from time to time. Any changes will be posted on this page with an updated date. Continued use of the website after such changes constitutes your acceptance of the new Terms.</p>
          
          <h4>9. Governing Law</h4>
          <p>These Terms and Conditions are governed by and interpreted in accordance with the laws of [Insert Country or Jurisdiction]. Any disputes arising from the use of this website shall be subject to the exclusive jurisdiction of the courts in [Insert Location].</p>
          
          <h4>10. Contact Information</h4>
          <p>If you have any questions or concerns regarding these Terms, please contact us at:</p>
          <p>Email: [Insert Contact Email]</p>
        </div>
      </section>

    </main>
  );
}
