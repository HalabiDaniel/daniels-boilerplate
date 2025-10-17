# Project Structure

## Directory Organization

### `/app` - Next.js App Router
- **`layout.tsx`**: Root layout with ClerkProvider, ThemeProvider, and ConditionalLayout wrapper
- **`page.tsx`**: Home page composed of reusable section components
- **`globals.css`**: Global styles and Tailwind directives
- **`/api`**: API routes (e.g., subscription management, webhooks)
- **`/dashboard`**: Protected dashboard routes (requires authentication via middleware)
- **`/checkout-handler`**: Payment flow pages

### `/components` - React Components
- **`/home`**: Landing page sections (Hero1, Hero2, About1, SideBySide, Testimonials, Pricing, HowItWorks)
- **`/layouts`**: Layout components (ConditionalLayout for route-based layout switching)
- **`/ui`**: ShadCN UI components (buttons, inputs, theme provider, etc.)

### `/lib` - Utilities and Configuration
- **`subscription-plans.ts`**: Centralized subscription plan configuration (single source of truth)
- **`subscription-helpers.ts`**: Helper functions for subscription logic
- **`utils.ts`**: General utility functions (e.g., cn for className merging)

### `/convex` - Convex Database
- Database schema, queries, and mutations
- **`README.md`**: Convex-specific documentation
- **`/_generated`**: Auto-generated Convex types

### `/public` - Static Assets
- Images, logos, SVGs, and other static files
- Dashboard screenshots and hero images

### Root Configuration Files
- **`middleware.ts`**: Clerk authentication middleware (protects `/dashboard` routes)
- **`tsconfig.json`**: TypeScript configuration with strict mode and path aliases
- **`next.config.ts`**: Next.js configuration
- **`components.json`**: ShadCN component configuration
- **`Style-Guide.md`**: Detailed design system documentation

## Key Patterns

### Path Aliases
Use `@/` to import from project root:
```typescript
import { Button } from "@/components/ui/button"
import { getPlanById } from "@/lib/subscription-plans"
```

### Component Composition
Pages are composed of smaller, reusable section components rather than monolithic page files.

### Protected Routes
Routes under `/dashboard` are automatically protected by Clerk middleware defined in `middleware.ts`.

### Subscription Management
All subscription plan configuration lives in `lib/subscription-plans.ts`. Update plan IDs there to match Clerk dashboard configuration.

### Checkout Flow
- **Guest users**: Sign up via Clerk modal, then redirect to `/dashboard` (free plan) or `/dashboard/billing` (paid plans)
- **Logged-in users**: Click upgrade button which stores plan info and redirects to `/dashboard/billing`
- The billing page displays plan details and a checkout button (requires Stripe integration to complete)

### Layout Strategy
`ConditionalLayout` component handles different layouts for different routes (e.g., landing page vs. dashboard).
