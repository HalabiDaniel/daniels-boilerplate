# Tech Stack

## Core Framework

- **Next.js 15.5.5** with App Router
- **React 19.1.0**
- **TypeScript 5**
- **Turbopack** for builds and development

## Key Dependencies

- **Authentication**: Clerk (@clerk/nextjs)
- **Database**: Convex
- **UI Components**: ShadCN (Radix UI primitives)
- **Styling**: Tailwind CSS 4 with PostCSS
- **Icons**: Lucide React
- **Theme**: next-themes for dark mode
- **Webhooks**: svix for Clerk webhook verification
- **Utilities**: clsx, tailwind-merge, class-variance-authority

## Development Tools

- **Linting**: ESLint with Next.js config
- **Type Checking**: TypeScript with strict mode enabled

## Common Commands

### Development
```bash
npm run dev          # Start dev server with Turbopack
npx convex dev       # Initialize/run Convex database
```

### Production
```bash
npm run build        # Build for production with Turbopack
npm start            # Start production server
```

### Code Quality
```bash
npm run lint         # Run ESLint
```

### Local Development with Webhooks
```bash
npm install -g ngrok
ngrok http 3000      # Expose local server for webhook testing
```

## Build System

- Uses Turbopack for faster builds and hot module replacement
- TypeScript compilation with target ES2017
- Module resolution: bundler
- Path alias: `@/*` maps to project root

## Environment Variables

Required environment variables are documented in `.env.example`:
- Convex deployment and URL
- Clerk authentication keys and URLs
- Clerk webhook secret
- App URL for redirects
