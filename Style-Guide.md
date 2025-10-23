# Style Guide

## Typography

### Fonts
- **Primary Font**: Inter

### H1 Heading
- **Font Size**: 52px
- **Font Weight**: Semibold (600)
- **Line Height**: 
  - Mobile: 36px
  - Desktop: 62px
- **Letter Spacing**: -1.35px (--tracking-tight or --tracking-tighter)
- **Color**: --foreground
- **Font**: --font-sans
- **Use Cases**: Used only in hero-1.tsx and hero-2.tsx as the main title of the hero section
- **Responsive**: Mobile: 30px (text-3xl), Desktop: 52px
- **Notes**: Supports highlighted text spans with gradient effect

### H2 Heading
- **Font Size**: 42px
- **Font Weight**: Semibold (600)
- **Color**: --foreground
- **Font**: --font-sans
- **Use Cases**: Main heading of sections across the website (about-1.tsx, how-it-works.tsx, side-by-side.tsx, testimonials.tsx, pricing.tsx, footer CTA, page-title.tsx, about-faqs.tsx, about-info.tsx, about-intro.tsx, about-team.tsx, contact/form.tsx, contact/map.tsx)
- **Notes**: Maintains proper contrast in both light and dark themes

### H3 Heading
- **Font Size**: text-xl md:text-3xl
- **Font Weight**: Semibold (600)
- **Color**: --foreground
- **Font**: --font-sans
- **Use Cases**: General subsection headings across the site
- **Notes**: Maintains visual hierarchy with responsive sizing

### H4 Heading
- **Font Size**: text-lg md:text-2xl
- **Font Weight**: Semibold (600)
- **Color**: --foreground
- **Font**: --font-sans
- **Use Cases**: Smaller section divisions
- **Notes**: Appropriate sizing for nested content

### H5 Heading
- **Font Size**: text-base md:text-xl
- **Font Weight**: Semibold (600)
- **Color**: --foreground
- **Font**: --font-sans
- **Use Cases**: Detailed content organization
- **Notes**: Maintains readability at smaller sizes

### H6 Heading
- **Font Size**: text-sm md:text-lg
- **Font Weight**: Semibold (600)
- **Color**: --foreground
- **Font**: --font-sans
- **Use Cases**: Fine-grained content structure
- **Notes**: Ensures sufficient contrast in both themes

### Paragraph Text
- **Font Size**: 
  - 16px: Used in hero-1.tsx, hero-2.tsx, footer CTA, pricing card descriptions, testimonial text
  - 15px: Used in almost all other text across the site
- **Font Weight**: Regular (400)
- **Line Height**: 28px
- **Color**: --foreground or --muted-foreground
- **Font**: --font-sans
- **Use Cases**: Default body text across the website
- **Max Width**: 450-600px (for optimal readability)
- **Notes**: Available in both standard and muted variants

### Ordered List
- **Color**: --foreground
- **Font**: --font-sans
- **Spacing**: space-y-2
- **Use Cases**: Sequential content presentation
- **Notes**: Includes proper spacing and indentation

### Unordered List
- **Color**: --foreground
- **Font**: --font-sans
- **Spacing**: space-y-2
- **Use Cases**: Non-sequential content lists
- **Notes**: Matches ordered list spacing for consistency

### Highlighted Text
- **Background**: Linear gradient with --primary (0-80%) to --foreground (80-100%)
- **Background Clip**: text
- **Text Fill Color**: transparent
- **Font**: Inherits from parent element
- **Size**: Inherits from parent element
- **Weight**: Inherits from parent element
- **Use Cases**: Emphasis within text content (headings, paragraphs, or any text element)
- **Implementation**: Applied via `<span>` inside any text element
- **Notes**: Creates gradient effect for visual emphasis without changing font properties

### Hero Section Typography (Legacy Reference)

#### Pill Badge
- **Font Size**: 13px
- **Font Weight**: Regular
- **Line Height**: Normal
- **Letter Spacing**: Normal
- **Color (Light)**: White
- **Color (Dark)**: White
- **Background**: Linear gradient (oklch(0.5 0.134 242.749) → oklch(0.293 0.066 243.157) → black)
- **Border**: 2px white

#### Button Text
- **Font Size**: 14px (text-sm)
- **Font Weight**: Medium (inherited from button component)
- **Color (Light)**: Inherited from button component
- **Color (Dark)**: White

#### Input Field
- **Font Size**: 14px (text-sm)
- **Font Weight**: Regular
- **Placeholder Color (Light)**: #262626
- **Placeholder Color (Dark)**: White with 70% opacity
- **Text Color (Light)**: #262626
- **Text Color (Dark)**: White

## Colors

### Background Colors
- **Hero Section (Light)**: #F4F7F3
- **Hero Section (Dark)**: neutral-900 (Tailwind)
- **Input Field (Light)**: oklch(0.922 0 0)
- **Input Field (Dark)**: #262626

### Border Radius
- **Pill Badge**: Full (rounded-full)
- **Input Field**: 12px (rounded-xl)
- **Hero Image**: 16px (rounded-2xl)
- **Buttons**: Inherited from button component

## Spacing

### Hero Section
- **Container Padding**: 16px (px-4)
- **Vertical Padding**: 64px (py-16)
- **Content Max Width**: 720px
- **Image Max Width**: 1200px
- **Gap between elements**: 24px (space-y-6)

### Input Field
- **Container Padding**: 6px (p-1.5)
- **Input Horizontal Padding**: 12px (px-3)
- **Input Vertical Padding**: 8px (py-2)
- **Button Padding**: 24px horizontal (px-6), 10px vertical (py-2.5)
- **Gap**: 4px (gap-1)

## Buttons

### Primary Button (Default)
- **Variant**: default
- **Background Color**: --primary (oklch(0.5 0.134 242.749) blue) - same in light and dark mode
- **Text Color**: --primary-foreground (white) - always white in both light and dark mode
- **Font Size**: 14px (text-sm)
- **Font Weight**: Medium
- **Padding**: 24px horizontal (px-6), 12px vertical (py-3)
- **Height**: 44px (h-11)
- **Border Radius**: --radius-md (6px, rounded-md)
- **Hover Behavior**:
  - **Light Mode**: Background becomes --foreground, text becomes --muted
  - **Dark Mode**: Background becomes --secondary
- **Use Cases**: Main CTAs, primary actions in hero-1.tsx, how-it-works.tsx, side-by-side.tsx, pricing.tsx, footer CTA, about-team.tsx, about-faqs.tsx, expandable-user-card.tsx, dashboard/billing/page.tsx
- **Notes**: Most commonly used button style; text color is always white regardless of theme

### Outline Button
- **Variant**: outline
- **Background Color**: Transparent
- **Text Color**: --foreground
- **Border**: --border (2px solid)
- **Shadow**: None
- **Font Size**: 14px (text-sm)
- **Font Weight**: Medium
- **Padding**: 24px horizontal (px-6), 12px vertical (py-3)
- **Height**: 44px (h-11)
- **Border Radius**: --radius-md (6px, rounded-md)
- **Hover Behavior**:
  - **Light Mode**: Background becomes --foreground, text becomes --muted
  - **Dark Mode**: Background becomes --background, text becomes --foreground
- **Use Cases**: Secondary actions across the site, dashboard button for logged-in users in header
- **Notes**: Good for secondary actions with proper theme support

### Outline Icon Button
- **Variant**: outline
- **Size**: icon (40x40px)
- **Background Color**: Transparent
- **Icon Color**: --foreground
- **Border**: --border (2px solid)
- **Shadow**: None
- **Border Radius**: --radius-md (6px, rounded-md)
- **Hover Behavior**:
  - **Light Mode**: Background becomes --foreground, icon becomes --muted
  - **Dark Mode**: Background becomes --background, icon becomes --foreground
- **Use Cases**: Icon-only actions like social links, GitHub button in Hero 1 for logged-in users
- **Notes**: Proper touch target size (40x40px) ensured for accessibility

### Secondary Button (Light on Dark)
- **Variant**: secondary
- **Background Color**: --background (white)
- **Text Color**: --foreground (#262626)
- **Font Size**: 14px (text-sm)
- **Font Weight**: Medium
- **Padding**: 24px horizontal (px-6), 12px vertical (py-3)
- **Height**: 44px (h-11)
- **Border Radius**: --radius-md (6px, rounded-md)
- **Hover Behavior**: Background becomes --foreground, text becomes --background
- **Use Cases**: CTAs on dark/blue backgrounds (footer CTA section, contact-us/form.tsx)
- **Notes**: Designed for dark backgrounds; colors apply to both light and dark mode

### Transitioned Input Button
- **Initial State**: Same as Primary Button
- **Background Color**: --primary (oklch(0.5 0.134 242.749) blue) - same in light and dark mode
- **Text Color**: --primary-foreground (white) - always white in both light and dark mode
- **Focused State**: Shrinks to icon-only (42x42px square)
- **Icon**: ArrowRight (white)
- **Border Radius**: --radius-md (6px, rounded-md)
- **Button Height**: Fixed at 42px
- **Animation Timing**:
  - Shrink Duration: 500ms
  - Expand Duration: 400ms
  - Easing: cubic-bezier(0.4, 0, 0.2, 1)
  - Text Fade: Instant hide, 150ms fade-in with 100ms delay
- **Use Cases**: Input fields with submit buttons (hero-1.tsx, footer.tsx)
- **Notes**: Complex animation with smooth transitions; text and icon color are always white regardless of theme

### Ghost Icon Button (Theme Toggle)
- **Variant**: ghost
- **Size**: icon (40x40px)
- **Background Color**: Transparent
- **Icon Color**: --foreground (inherits)
- **Hover Background**: --accent (subtle)
- **Icon Size**: 1.2rem (h-[1.2rem] w-[1.2rem])
- **Border Radius**: --radius-md (6px, rounded-md)
- **Icons**: Sun (light mode) / Moon (dark mode)
- **Animation**: Rotate transition on theme change
  - Sun: rotate-0 scale-100 (light) → -rotate-90 scale-0 (dark)
  - Moon: rotate-90 scale-0 (light) → rotate-0 scale-100 (dark)
- **Use Cases**: Theme toggle in header
- **Accessibility**: aria-label="Toggle theme"
- **Notes**: Includes state management for theme switching with smooth rotation

## Cards and Containers

### Empty Card Div
- **Background**: --card
- **Color**: --card-foreground
- **Border**: --border
- **Border Radius**: --radius-lg
- **Shadow**: --shadow
- **Use Cases**: Foundation for custom card layouts
- **Notes**: Base card structure that serves as foundation for other card variants

### Image with Offset Background
- **Background**: --primary or gradient
- **Border Radius**: --radius-lg
- **Offset**: 20px translate
- **Use Cases**: Used in side-by-side.tsx and about-info.tsx
- **Notes**: Decorative element that creates depth effect with blue offset background pattern

### Pill Badge
- **Background**: Linear gradient with --primary
- **Color**: --primary-foreground
- **Border Radius**: full (pill shape)
- **Font**: --font-sans
- **Font Size**: 13px (text-[13px])
- **Use Cases**: Used in almost every section in /components/home, footer CTA, how-it-works.tsx steps, all sections in /components/about-us and /components/contact-us
- **Notes**: Widely used component for labels and tags; includes gradient background

### Testimonial Card
- **Background**: --card
- **Color**: --card-foreground
- **Border**: --border
- **Border Radius**: --radius-lg
- **Shadow**: --shadow
- **Quote Color**: --muted-foreground
- **Use Cases**: Used only in components/home/testimonials.tsx
- **Layout Components**:
  - Avatar section
  - Quote text
  - Attribution (name and role)
  - Metric section
- **Notes**: Specialized card for displaying user testimonials with structured layout

### Pricing Card
- **Background**: --card
- **Color**: --card-foreground
- **Border**: --border
- **Border Radius**: --radius-lg
- **Shadow**: --shadow
- **Accent Color**: --primary
- **Use Cases**: Used only in components/home/pricing.tsx
- **Layout Components**:
  - Plan name and price
  - Feature list with checkmarks
  - CTA button
  - Optional featured badge
- **Notes**: Specialized card for displaying pricing plans with feature lists

## Interactive Elements

### Toggle Switch
- **Background (off)**: --input
- **Background (on)**: --primary
- **Thumb Color**: --background
- **Border Radius**: full
- **Focus Ring**: --ring
- **Use Cases**: Used in components/home/pricing.tsx for monthly/annual pricing selection
- **Notes**: Includes accessible keyboard controls and smooth transitions between states

### Accordion Component
- **Background**: --background
- **Border**: --border
- **Color**: --foreground
- **Hover Background**: --accent
- **Transition**: smooth expand/collapse
- **Use Cases**: Used only in components/about-us/about-faqs.tsx
- **Animation Details**:
  - Smooth expand/collapse animation
  - Chevron rotation on state change
  - Content fade-in effect
- **Notes**: Based on ShadCN accordion component with smooth animations

### Action Element
- **Icon Container Background**: --primary with 10% opacity (rounded-lg)
- **Icon Color**: --primary
- **Title Color**: --foreground
- **Text Color**: --muted-foreground
- **Hover Effects**:
  - Icon container becomes solid --primary color
  - Icon turns white
  - Title changes to --primary color
- **Transition**: smooth 300ms
- **Use Cases**: Used only in components/contact-us/actions.tsx
- **Notes**: Fully functional interactive element with hover effects and proper link behavior

## Specialized Components

### Team Member Card
- **Background**: --card
- **Color**: --card-foreground
- **Border**: --border
- **Border Radius**: --radius-lg
- **Shadow**: --shadow
- **Icon Hover Color**: --primary
- **Use Cases**: Used only in components/about-us/about-team.tsx
- **Layout Components**:
  - Team member image
  - Name and role
  - Social links (with hover effects)
- **Hover Effects**:
  - Card background changes to --primary color
  - Button changes to dark
- **Notes**: Includes smooth hover transitions for interactive social links

### Info Element (Icon + Title + Text)
- **Icon Color**: --primary
- **Title Color**: --foreground
- **Text Color**: --muted-foreground
- **Font**: --font-sans
- **Use Cases**: Currently only used in components/about-us/about-info.tsx
- **Layout Components**:
  - Icon (with primary color)
  - Heading/title
  - Description text
- **Notes**: Versatile component for feature lists; clean and reusable structure

### Number Counter Element
- **Number Color**: --primary or --foreground
- **Label Color**: --muted-foreground
- **Font**: --font-sans
- **Number Size**: text-4xl md:text-[56px]
- **Use Cases**: Currently only used in about-us/about-intro.tsx
- **Layout Components**:
  - Large number display
  - Superscript "+" symbol
  - Label text below
- **Notes**: Includes superscript "+" symbol with proper positioning; different from the counter in components/home/about-1.tsx

### Membership Card
- **Background**: --card
- **Color**: --card-foreground
- **Border**: --border
- **Border Radius**: --radius-lg
- **Badge Background**: --primary
- **Badge Color**: --primary-foreground
- **Use Cases**: Used in components/layouts/expandable-user-card.tsx and app/dashboard/layout.tsx
- **Layout Components**:
  - Dashboard icon
  - Plan name
  - Badge (Free/Pro/Premium)
  - Expiry status
- **Notes**: Shows user's current subscription plan and status

### User Initials Avatar
- **Background**: Dynamic color generation (--primary or generated color)
- **Color**: --primary-foreground or contrasting color
- **Border Radius**: full (circle)
- **Font**: --font-sans
- **Size Variants**:
  - Small: h-8 w-8 (32x32px)
  - Medium: h-12 w-12 (48x48px)
  - Large: h-16 w-16 (64x64px)
- **Use Cases**: Used in app/dashboard/layout.tsx (both /dashboard and /admin) and components/layouts/expandable-user-card.tsx
- **Notes**: Displays user initials in a circular avatar; demonstrates multiple size variants for different use cases

## Animations

### Button Transition (Input Fields)
- **Shrink Duration**: 500ms
- **Expand Duration**: 400ms
- **Easing**: cubic-bezier(0.4, 0, 0.2, 1)
- **Text Fade**: Instant hide, 150ms fade-in with 100ms delay
- **Button Height**: Fixed at 42px
- **Icon Button Size**: 42x42px


## Sidebar Components

### Expandable User Card

The user card at the bottom of the sidebar in `/dashboard` and `/admin` layouts has an expandable feature:

#### Collapsed State (Default)
- **Container**: Border, rounded-lg, p-3, bg-card
- **Hover**: bg-accent/50 transition
- **Cursor**: pointer
- **Layout**: Horizontal flex with gap-3
- **User Avatar**: 
  - Size: 32x32px (h-8 w-8)
  - Background: oklch(0.5 0.134 242.749)
  - Text: White, text-sm, font-semibold
  - Content: User initials
- **User Name**: text-sm, font-medium, truncated
- **Logout Button**: Ghost variant, icon size (32x32px)

#### Expanded State
- **Animation**: expand-card (0.3s cubic-bezier)
- **Container**: Takes full remaining height of sidebar
- **Padding**: p-6
- **Layout**: Vertical flex column

**Header Row:**
- Edit button (left): Ghost variant, icon size
- User avatar (center): 48x48px (h-12 w-12), larger initials (text-lg)
- Close button (right): Ghost variant, icon size with X icon

**User Information:**
- Full name: text-base, font-semibold, centered
- Email: text-sm, text-muted-foreground, centered
- Spacing: mb-4 between sections

**Cards Section:**
- Membership card: Always shown
- Admin access level card: Only shown if user is admin
- Spacing: space-y-3, mb-6

**Logout Button:**
- Full width (w-full)
- Primary button style (default variant)
- Background: oklch(0.5 0.134 242.749)
- Text: White with logout icon
- Icon: LogOut from lucide-react (h-4 w-4 mr-2)

#### Behavior
- Clicking anywhere on collapsed card expands it (except logout button)
- When expanded, sidebar navigation links and membership/admin cards are hidden
- Edit button redirects to `/dashboard/my-account` (even from `/admin`)
- Close button returns card to collapsed state and restores sidebar content
- Logout button signs out the user in both states

#### Animation Details
```css
@keyframes expand-card {
  from {
    height: auto;
    opacity: 0.8;
  }
  to {
    height: 100%;
    opacity: 1;
  }
}
```
