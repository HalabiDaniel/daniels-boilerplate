# Next.js Daniel's Boilerplate


![Next.js Daniel's Boilerplate](https://res.cloudinary.com/dbactyzwl/image/upload/v1761045720/thumbnail_odybfx.png)


## Table of Contents

- [About the Boilerplate](#about-the-boilerplate)
- [Upcoming Features](#upcoming-features)
- [License & Usage](#license--usage)
- [Getting Started](#getting-started)
- [Tech Stack](#tech-stack)
- [Environment Setup](#environment-setup)
- [Editing the Theme](#editing-the-theme)
- [Database Setup (Convex)](#database-setup-convex)
- [Authentication Setup (Clerk)](#authentication-setup-clerk)
- [Using ngrok for Local Development](#using-ngrok-for-local-development)
- [Adding Admin Users](#adding-admin-users)
- [Payments Setup (Stripe)](#payments-setup-stripe)
- [File Storage Setup (Cloudinary)](#file-storage-setup-cloudinary)
- [Email System (Resend)](#email-system-resend)
- [Next Steps](#next-steps)


## About the Boilerplate

A production-ready Next.js boilerplate designed to accelerate your development workflow. Created by Daniel Halabi, this project comes fully configured with essential integrations and pre-built pages, so you can focus on building your product instead of infrastructure.

**What's included:**
- Complete landing page with 10+ customizable sections
- Full "About Us," "Contact Us," privacy policy, and terms pages
- Admin dashboard for user and subscription management
- Pre-configured integrations: Convex (database), Clerk (auth), Stripe (payments), Resend (email), Cloudinary (storage)

Start building immediately with a beautiful, functional website foundation.


## Upcoming Features

**Done:**
- [x] Full mobile responsiveness
- [x] Organized components & sections library
- [x] Dynamic theming (colors & fonts)
- [x] Admin dashboard (users, subscriptions, more)
- [x] Cloudinary image/file upload & storage

**In Development:**
- [ ] PostHog analytics integration
- [ ] Resend email system
- [ ] Animated pages


## License & Usage

This project is released under the MIT license and is completely free to use, modify, extend, and share. I'd genuinely love to see what you build with it. Feel free to reach out and share your projects at `daniel@eddan.co`. Your feedback and creations inspire future improvements!


## Getting Started

Get up and running in just a few commands. Make sure you have Node.js installed, then follow these steps:

1. **Install dependencies:**
```bash
npm install
```

2. **Start the development server:**
```bash
npm run dev
```

3. **Initialize your database (Convex):**
```bash
npx convex dev
```

4. **Ready to deploy?**
```bash
npm run build
```

Your site will be available at `http://localhost:3000` during development.


## Tech Stack

This boilerplate is built with modern, battle-tested technologies:

- **Frontend:** Next.js with TypeScript for type safety and scalability
- **UI Components:** ShadCN for beautiful, accessible components
- **Database:** Convex for real-time data syncing and scalability
- **Authentication:** Clerk for secure user management
- **Payments:** Stripe for subscription handling and transactions
- **Email:** Resend for reliable email delivery
- **File Storage:** Cloudinary for image and media management
- **Code Quality:** ESLint for consistent code standards

## Environment Setup

Getting your API keys configured is straightforward. All the environment variables you'll need are documented in the `.env.example` file, it serves as a complete checklist of what to set up.

Before you start any integrations (Convex, Clerk, Stripe, etc.), copy `.env.example` to `.env.local` and fill in your API keys as you configure each service. Detailed setup instructions for each integration are provided in their respective sections below.


## Editing the Theme

Customize your site's colors and typography globally with a few simple CSS edits. No need to hunt through component files unless you want to fine-tune specific elements.

**How it works:**
- All design tokens (colors, fonts, spacing) are stored in `/app/globals.css`
- Update these variables and the changes instantly apply across your entire site
- For element-specific customization, open the corresponding component file (e.g., `button-elements.tsx`) and modify its styles

This centralized approach makes rebranding or theming your site a breeze.


## Database Setup (Convex)

Start your Convex database:
```bash
npx convex dev
```

The terminal will guide you through authentication and project creation when you run this for the first time. Just follow the prompts!

Keep this running while you develop. When deploying to production:
```bash
npx convex deploy
```


## Authentication Setup (Clerk)

Clerk handles all your authentication needs with minimal configuration. It's easy to set up, affordable, and rock-solid reliable.

**Step-by-step setup:**

1. **Create a Clerk account**. Sign up for free at https://clerk.com

2. **Create your application**. Click "Create Application," enter a name, and select your preferred sign-in methods

3. **Add API keys**. From the quickstart page, select Next.js, then copy your API keys:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   
   Paste these into your `.env.local` file (see `.env.example` for reference)

4. **Configure webhooks**. Sync user data with Convex:
   - Go to **Webhooks** in your Clerk Dashboard
   - Click **+ Add Endpoint**
   - Set URL to `https://yourdomain.com/api/webhooks/clerk` (use ngrok for local development)
   - Select these events: `user.created` and `user.updated`
   - Copy the **Signing Secret** and add it as `CLERK_WEBHOOK_SECRET` to `.env.local`

5. **Finish configuration**. Follow Clerk's on-screen prompts to configure sign-up and sign-in flows, then start your server


## Using ngrok for Local Development

When testing webhooks locally, you need to expose your local server to the internet so external services like Clerk and Stripe can reach your webhook endpoints. ngrok creates a secure tunnel from your machine to a public URL. While this section explains how to setup your local development server with ngrok, you can also use an alternative service like pinggy.io. Both services offer reasonable free plans, but if you need the paid plans, pinggy.io offers a more affordable service.

**Why you need this:**
- Webhook services can't reach `localhost:3000` from the internet
- ngrok gives you a public URL that forwards requests to your local server
- Perfect for testing before deploying to production

**Setup with a static domain (recommended):**

1. **Install ngrok**. Download from https://ngrok.com/download and follow the installation for your OS

2. **Create account & get auth token**. Sign up at https://ngrok.com, go to your dashboard, and copy your auth token

3. **Configure your auth token in your terminal:**.
```bash
ngrok config add-authtoken YOUR_AUTH_TOKEN
```

4. **Claim a static domain**. In your ngrok dashboard, claim a free static domain (e.g., `https://yourname-yourname-yourname.ngrok-free.dev/`)

5. **Start ngrok with your static domain**. In a terminal, run:
```bash
ngrok http 3000 --domain yourname-yourname-yourname.ngrok-free.dev
```

6. **Use your static URL**. Add your domain to your Clerk and Stripe webhook endpoints (e.g., `https://yourname-yourname-yourname.ngrok-free.dev/api/webhooks/clerk`)

**Keep it running:** Leave ngrok running in a terminal while you develop. Since you have a static domain, you only set up your webhooks once!


## Adding Admin Users

Grant admin access to users quickly using our interactive admin script. This handles everything for you, so no manual database updates are needed.

**Before you start:**
- The user must already have an account (signed up at least once)
- Your `.env.local` file must have: `NEXT_PUBLIC_CONVEX_URL` and `CLERK_SECRET_KEY`

**Add an admin:**

1. **Run the admin script:**
```bash
npm run add-admin
```

2. **Follow the prompts:**
   - Enter the user's Clerk ID (starts with `user_`)
   - Choose an access level

3. **Done!** The script handles all the backend setup

**Finding a Clerk ID:**
1. Go to your Clerk Dashboard
2. Click **Users**
3. Select the user you want to promote
4. Copy their User ID (starts with `user_`)

**Access Levels:**
- **Full Access** — Manage other admins and full dashboard control
- **Partial Access** — Reduced admin capabilities
- **Limited Access** — Very minimal admin access


## Payments Setup (Stripe)

Set up Stripe to handle subscriptions and payments. This boilerplate comes pre-configured to work with Stripe, you just need to create your products and add your API keys.

**Step-by-step setup:**

1. **Access your Stripe Dashboard**. Log in at https://dashboard.stripe.com. Make sure you're in **test mode** or **sandbox mode** while setting up.

2. **Create subscription products**. For each pricing tier:
   - Click **Products** in the sidebar and select **+ Add Product**
   - Enter product details and select "Recurring" for subscriptions
   - Set your prices (you can have monthly AND yearly pricing for the same product)
   - Save and copy the **Price ID** (not the Product ID)

3. **Update your subscription plans**. Open `lib/subscription-plans.ts` and add your Stripe Price IDs:
```typescript
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Free Plan",
    stripePriceIdMonthly: null, // Free plan does not need a Stripe priceID
    stripePriceIdAnnual: null, // Free plan does not need a Stripe priceID
  },
  {
    id: "pro",
    name: "Pro Plan",
    stripePriceIdMonthly: "price_YOUR_PRO_MONTHLY_ID",
    stripePriceIdAnnual: "price_YOUR_PRO_ANNUAL_ID",
  },
];
```

4. **Configure your customer portal**. Users need a way to manage their subscriptions:
   - Go to **Settings** → **Billing** → **Customer portal**
   - Click **Activate test link** (for test mode)
   - Add your business details (name, email, privacy policy URL)
   - Make sure you see the customer portal URL. You don't need to put this anywhere, the website will automatically retrieve it if you enabled it.

5. **Add your API keys**. Back in the Stripe Dashboard, find your **Publishable Key** and **Secret Key** under your API keys. Copy both to your `.env.local` file.

6. **Set up webhooks**. Stripe needs to notify your app about payment events:
   - Go to **Developers** → **Webhooks** and click **+ Add endpoint**
   - Set the URL to `https://yourdomain.com/api/webhooks/stripe` (use ngrok for local development)
   - Select these events:
     - ✅ `checkout.session.completed`
     - ✅ `customer.subscription.created`
     - ✅ `customer.subscription.updated`
     - ✅ `customer.subscription.deleted`
     - ✅ `invoice.payment_failed`
   - Copy the **Signing Secret** and add it to `.env.local` as `STRIPE_WEBHOOK_SECRET`

**Test your setup:**
- Use these test card numbers to make test payments:
  - Visa: `4242 4242 4242 4242`
  - Mastercard: `5555 5555 5555 4444`
- Try subscribing to different plans and check that webhooks are being received


## File Storage Setup (Cloudinary)

Cloudinary stores and optimizes your images, videos, and documents in the cloud. This boilerplate comes with pre-built upload components that handle everything. Just add your credentials and you're ready to go.

1. **Create a Cloudinary account**. Sign up for free at https://cloudinary.com

2. **Get your credentials**. From your Cloudinary Dashboard, copy:
   - Cloud Name
   - API Key
   - API Secret

3. **Add to your environment**. Paste these into `.env.local`:
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

4. **Start uploading**. Use the pre-built components:
```tsx
import { UploadButton, UploadCard } from '@/components/daniels-elements/elements/upload-elements';
```


## Email System (Resend)

Send reliable transactional emails with Resend. The boilerplate comes pre-configured with a password reset email template, and you can easily add more templates for onboarding, notifications, and other user actions.

1. **Create a Resend account**. Sign up for free at https://resend.com

2. **Get your API key**. Navigate to the [API Keys](https://resend.com/api-keys) page and copy your API key (starts with `re_`). You can also obtain one during the onboarding process.

3. **Configure your domain (optional)**. Go to the [Domains](https://resend.com/domains) page and add your domain. Then simply follow the DNS configuration steps provided.

For development and testing, you can skip this and use Resend's default email instead (see below).

**Add environment variables**. Paste these variables into `.env.local`:
```env
RESEND_API_KEY=re_your_actual_api_key_here
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

5. **Test your setup**. During development, you can use Resend's default email `onboarding@resend.dev` to send test emails (limited to your Resend account email only). Once you verify your domain, you can send to any email address.


## Next Steps

You've got everything set up! Your boilerplate is now ready to go. Here's what to do next:

1. **Explore the components**: Check out the organized component library to see what's available
2. **Customize your branding**: Update the theme colors and typography in `/app/globals.css`
3. **Start building**: Use the pre-built pages as a foundation and add your unique features
4. **Deploy**: When you're ready, use `npm run build` and deploy to your favorite platform

If you run into any issues or have feedback, reach out at daniel@eddan.co. I'd love to hear about what you're building!

Happy coding! 🚀