import PageTitle from "@/components/layouts/page-title";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen">

      <PageTitle
        pillText="Legal"
        pageTitle="Privacy"
        pageTitleHighlighted="Policy"
        description={<>Our Privacy Policy page explains how we collect, use, and protect your personal information to ensure your data stays safe and secure.<br /><b>Last updated on:</b> October 18, 2025.</>}
      />

      <section className="container mx-auto px-6 md:px-8 lg:px-4 py-12 max-w-4xl">
        <div className="prose max-w-none">
          <p>This Privacy Policy explains how we collect, use, and protect your personal information when you use our website. By using this website, you agree to the terms described below.</p>

          <h4>1. Information We Collect</h4>
          <p>We collect the following information from you when you create an account or interact with our website:</p>
          <ul>
            <li>Full name</li>
            <li>Email address</li>
            <li>Password</li>
          </ul>
          <p>We may also collect non-personal information such as browser type, operating system, and usage data to improve our website's performance and user experience.</p>

          <h4>2. How We Use Your Information</h4>
          <p>We use your personal information to:</p>
          <ul>
            <li>Create and manage your user account</li>
            <li>Communicate with you about your account or our services</li>
            <li>Provide customer support</li>
            <li>Improve our website and services</li>
            <li>Ensure security and prevent unauthorized access</li>
          </ul>
          <p>We do not sell, rent, or trade your personal information to third parties.</p>

          <h4>3. Data Storage and Security</h4>
          <p>Your data is stored securely using industry-standard measures to protect it from unauthorized access, disclosure, or alteration. Your password is encrypted and cannot be viewed by anyone, including our team.</p>

          <h4>4. Sharing of Information</h4>
          <p>We may share your information only in the following cases:</p>
          <ul>
            <li>To comply with legal obligations or government requests</li>
            <li>To protect the rights and safety of our users or others</li>
            <li>With trusted service providers who assist in operating the website, under strict confidentiality agreements</li>
          </ul>

          <h4>5. Your Rights</h4>
          <p>You have the right to:</p>
          <ul>
            <li>Access and review your personal information</li>
            <li>Request correction or deletion of your information</li>
            <li>Withdraw your consent to data processing (if applicable)</li>
          </ul>
          <p>To exercise these rights, please contact us at [Insert Contact Email].</p>

          <h4>6. Cookies</h4>
          <p>Our website may use cookies to enhance user experience, analyze traffic, and improve functionality. You can disable cookies in your browser settings, but some features of the site may not function properly without them.</p>

          <h4>7. Data Retention</h4>
          <p>We retain your personal information as long as your account is active or as needed to provide our services. When you delete your account, your personal data will be permanently removed from our systems within a reasonable timeframe.</p>

          <h4>8. Changes to This Policy</h4>
          <p>We may update this Privacy Policy periodically. Any changes will be posted on this page with the updated date.</p>

          <h4>9. Contact Us</h4>
          <p>If you have any questions or concerns about this Privacy Policy, please contact us at:</p>
          <p>Email: [Insert Contact Email]</p>
        </div>
      </section>
    </main>
  );
}
