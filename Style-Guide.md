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

## Animations

### Button Transition (Hero-1)
- **Shrink Duration**: 500ms
- **Expand Duration**: 400ms
- **Easing**: cubic-bezier(0.4, 0, 0.2, 1)
- **Text Fade**: Instant hide, 150ms fade-in with 100ms delay
- **Button Height**: Fixed at 42px
- **Icon Button Size**: 42x42px
