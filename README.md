# Next.js Daniel's Boilerplate

A personal boilerplate created by Daniel Halabi to facilitate building Next.js websites quickly and efficiently. The project includes a full landing page with at least 10 separate and interchangeable sections, a full "About Us" page, a full "Contact Us" page, privacy policy and terms pages, and a complete dashboard layout. The boilerplate has pre-prepared integrations with Convex as database, Clerk for authentication, Stripe for payment and subscription handling, Resend for emails, and Cloudinary for file storage. All you have to do is follow the simple steps below and you will have a fully functional and beautiful website to kickstart your projects.

## Upcoming Features
- [ ] Full mobile responsiveness across the website
- [ ] Organized list of components and sections allowing you to easily insert them anywhere
- [ ] Fully dynamic theming, which lets you change the website's colors and fonts in a matter of seconds using tweakcn.com
- [ ] Admin dashboard to manage users, subscriptions, and more.
- [ ] Analytics integration via PostHog

## License & Usage

This project is released under the MIT license and is freely available for anyone to use, replicate, expand, or reproduce. I'd love to see what you build with it - feel free to share your work at daniel@eddan.co

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Initialize Convex (for database):
```bash
npx convex dev
```

4. Deploy when ready:
```bash
npm run build
```

## Tech Stack

- **Next.js** (with TypeScript)
- **UI Components**: ShadCN (themed using tweakcn.com)
- **Database**: Convex
- **Authentication**: Clerk
- **Email**: Resend
- **File Storage**: Cloudinary (for user content and photos)
- **Payments**: Stripe
- **Linting**: ESLint

## Environment Setup

Check the `.env.example` file to understand what environment variables and API keys are needed for the project.

## Authentication Setup (Clerk)

The authentication system in this boilerplate uses Clerk. Clerk is easy to use and setup, relatively affordable, and stable. 

1. Signup for a free Clerk account by visiting https://clerk.com.

2. Click create application, enter a name, and select the sign in options.

3. This will show you the quickstart page. Make sure you choose Next.js, and then copy the Clerk API Keys (NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY) and paste them in your .env.local file. See .env.example for more information.

4. Configure Clerk webhooks to sync users with your Convex database:
   - In your Clerk Dashboard, navigate to **Webhooks** in the sidebar
   - Click **+ Add Endpoint**
   - Set the **Endpoint URL** to `https://yourdomain.com/api/webhooks/clerk` (use ngrok for local development)
   - Select the following events:
     - ✅ `user.created`
     - ✅ `user.updated`
   - Copy the **Signing Secret** and add it to your `.env.local` as `CLERK_WEBHOOK_SECRET`

5. Follow the on-screen steps, configure your Clerk sign-up and sign-in settings, and run your server.

## Payments Setup (Stripe)

This section walks you through setting up Stripe payment integration for subscription management in Daniel's Next.js Boilerplate.

1. Log in to your Stripe Dashboard at https://dashboard.stripe.com and access test/sandbox mode in your project.

2. Create a product for each paid subscription tier. Add the product details, select "recurring" if it's a subscription, and set a price. You can set more than one price for a single product, for example, a monthly price and a yearly price.

3. Update `lib/subscription-plans.ts` with your Stripe PriceIDs (not the ProductID). 
```typescript
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Free Plan",
    // ... other fields
    stripePriceIdMonthly: null,
    stripePriceIdAnnual: null,
  },
  {
    id: "pro",
    name: "Pro Plan",
    // ... other fields
    stripePriceIdMonthly: "price_YOUR_PRO_MONTHLY_ID", // Replace with your Price ID
    stripePriceIdAnnual: "price_YOUR_PRO_ANNUAL_ID",   // Replace with your Price ID
  },
];
```

4. Configure your customer portal by navigating to **Settings** → **Billing** → **Customer portal**, and clicking **Activate test link** (for test mode). You will need to add business details like name, email, and privacy policy URL. Copy the URL of the billing page.

5. Back in the Stripe dashboard, you can see the Publishable Key and Secret Key. Copy and add those to your .env.local file. 

6. Now we need to configure the webhook for Stripe. Navigate to **Developers** → **Webhooks** and click **+ Add endpoint**. Configure the endpoint by adding the **Endpoint URL** which is `https://yourdomain.com/api/webhooks/stripe`. If you're still in local development, you can use ngrok to point your local server to a static domain. Make sure to select the following events to listen to:
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_failed`
Finally, copy the signing secret (starts with `whsec_`) and paste it in your .env.local file. 

Now you can make test payments and subscriptions on your website. Use the test credit-card numbers `4242 4242 4242 4242` for Visa `5555 5555 5555 4444` for Mastercard.