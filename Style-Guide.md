# Style Guide

## Typography

### Fonts
- **Primary Font**: Inter

### Hero Section Typography

#### Pill Badge
- **Font Size**: 13px
- **Font Weight**: Regular
- **Line Height**: Normal
- **Letter Spacing**: Normal
- **Color (Light)**: White
- **Color (Dark)**: White
- **Background**: Linear gradient (oklch(0.5 0.134 242.749) → oklch(0.293 0.066 243.157) → black)
- **Border**: 2px white

#### H1 Title
- **Font Size**: 
  - Mobile: 30px (text-3xl)
  - Desktop: 52px
- **Font Weight**: Semibold (600)
- **Line Height**: 
  - Mobile: 36px
  - Desktop: 62px
- **Letter Spacing**: -1.35px
- **Color (Light)**: oklch(0.145 0 0)
- **Color (Dark)**: White
- **Accent Color**: oklch(0.5 0.134 242.749) (for highlighted words)

#### Body Text / Description
- **Font Size**: 
  - Mobile: 16px (text-base)
  - Desktop: 16px
- **Font Weight**: Regular (400)
- **Line Height**: 
  - Mobile: 24px
  - Desktop: 28px
- **Letter Spacing**: Normal
- **Color (Light)**: #404040
- **Color (Dark)**: White
- **Max Width**: 450-600px

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
- **Background Color**: oklch(0.5 0.134 242.749) (primary blue) - same in light and dark mode
- **Text Color**: White - always white in both light and dark mode
- **Hover**: bg-primary/90
- **Font Size**: 14px (text-sm)
- **Font Weight**: Medium
- **Padding**: 24px horizontal (px-6), 12px vertical (py-3)
- **Height**: 44px (h-11)
- **Border Radius**: 6px (rounded-md)
- **Usage**: Main CTAs, primary actions (Get Started, etc.)
- **Note**: Text color is always white regardless of theme

### Outline Button
- **Variant**: outline
- **Background Color**: Transparent
- **Text Color (Light)**: #262626
- **Text Color (Dark)**: White
- **Border**: 2px solid #262626 (light mode) / white (dark mode)
- **Shadow**: None
- **Hover Background (Light)**: #262626
- **Hover Text (Light)**: White
- **Hover Background (Dark)**: White
- **Hover Text (Dark)**: #262626
- **Font Size**: 14px (text-sm)
- **Font Weight**: Medium
- **Padding**: 24px horizontal (px-6), 12px vertical (py-3)
- **Height**: 44px (h-11)
- **Border Radius**: 6px (rounded-md)
- **Usage**: Dashboard button for logged-in users in header

### Outline Icon Button
- **Variant**: outline
- **Size**: icon (40x40px)
- **Background Color**: Transparent
- **Icon Color (Light)**: #262626
- **Icon Color (Dark)**: White
- **Border**: 2px solid #262626 (light mode) / white (dark mode)
- **Shadow**: None
- **Hover Background (Light)**: #262626
- **Hover Icon (Light)**: White
- **Hover Background (Dark)**: White
- **Hover Icon (Dark)**: #262626
- **Border Radius**: 6px (rounded-md)
- **Usage**: GitHub button in Hero 1 for logged-in users

### Secondary Button (Light on Dark)
- **Background Color**: White
- **Text Color**: #262626
- **Hover**: bg-white/90
- **Font Size**: 14px (text-sm)
- **Font Weight**: Medium
- **Padding**: 24px horizontal (px-6), 12px vertical (py-3)
- **Height**: 44px (h-11)
- **Border Radius**: 6px (rounded-md)
- **Usage**: CTAs on dark/blue backgrounds (footer CTA section)
- **Note**: Colors apply to both light and dark mode

### Transitioned Input Button
- **Initial State**: Same as Primary Button
- **Background Color**: oklch(0.5 0.134 242.749) (primary blue) - same in light and dark mode
- **Text Color**: White - always white in both light and dark mode
- **Focused State**: Shrinks to icon-only (42x42px square)
- **Icon**: ArrowRight (white)
- **Shrink Duration**: 500ms
- **Expand Duration**: 400ms
- **Easing**: cubic-bezier(0.4, 0, 0.2, 1)
- **Text Fade**: Instant hide, 150ms fade-in with 100ms delay
- **Button Height**: Fixed at 42px
- **Usage**: Input fields with submit buttons (hero, footer newsletter)
- **Note**: Text and icon color are always white regardless of theme

### Ghost Icon Button (Theme Toggle)
- **Variant**: ghost
- **Size**: icon (40x40px)
- **Background Color**: Transparent
- **Icon Color (Light)**: Inherits from foreground
- **Icon Color (Dark)**: Inherits from foreground
- **Hover Background**: accent color (subtle)
- **Icon Size**: 1.2rem (h-[1.2rem] w-[1.2rem])
- **Icons**: Sun (light mode) / Moon (dark mode)
- **Animation**: Rotate transition on theme change
  - Sun: rotate-0 scale-100 (light) → -rotate-90 scale-0 (dark)
  - Moon: rotate-90 scale-0 (light) → rotate-0 scale-100 (dark)
- **Border Radius**: 6px (rounded-md)
- **Usage**: Theme toggle in header
- **Accessibility**: aria-label="Toggle theme"

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
- Edit button redirects to `/dashboard/profile-settings` (even from `/admin`)
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
