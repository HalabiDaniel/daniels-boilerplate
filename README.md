# Next.js Daniel's Boilerplate

A personal boilerplate created by Daniel Halabi to facilitate building Next.js websites quickly and efficiently.

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

## Authentication Setup

The authentication system in this boilerplate uses Clerk. Clerk is easy to use and setup, relatively affordable, and stable. 

### Authentication Setup

1. Signup for a free Clerk account by visiting https://clerk.com.

2. Click create application, enter a name, and select the sign in options.

3. This will show you the quickstart page. Make sure you choose Next.js, and then copy the Clerk API Keys (NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY) and paste them in your .env.local file. See .env.example for more information.

4. Follow the on-screen steps, configure your Clerk sign-up and sign-in settings, and run your server.