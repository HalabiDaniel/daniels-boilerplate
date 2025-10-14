# Next.js Personal Boilerplate

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