import { TypographyElements } from '@/components/daniels-elements/elements/typography-elements';
import { HighlightedTextShowcase } from '@/components/daniels-elements/elements/highlighted-text';
import { ElementCard } from '@/components/daniels-elements/element-card';
import {
  PrimaryButton,
  OutlineButton,
  OutlineIconButton,
  SecondaryButton,
  GhostIconButton,
  TransitionedInputButton,
  PRIMARY_BUTTON_CODE,
  OUTLINE_BUTTON_CODE,
  OUTLINE_ICON_BUTTON_CODE,
  SECONDARY_BUTTON_CODE,
  GHOST_ICON_BUTTON_CODE,
  TRANSITIONED_INPUT_BUTTON_CODE,
} from '@/components/daniels-elements/elements/button-elements';
import {
  InputWithButton,
  StandardInput,
  CompleteForm,
  FormWithValidation,
  INPUT_WITH_BUTTON_CODE,
  STANDARD_INPUT_CODE,
  COMPLETE_FORM_CODE,
  FORM_WITH_VALIDATION_CODE,
} from '@/components/daniels-elements/elements/form-elements';
import {
  EmptyCard,
  ImageWithOffset,
  PillBadge,
  TestimonialCard,
  PricingCard,
  EMPTY_CARD_CODE,
  IMAGE_WITH_OFFSET_CODE,
  PILL_BADGE_CODE,
  TESTIMONIAL_CARD_CODE,
  PRICING_CARD_CODE,
} from '@/components/daniels-elements/elements/card-elements';
import {
  ToggleSwitch,
  Accordion,
  ActionElementShowcase,
  TOGGLE_SWITCH_CODE,
  ACCORDION_CODE,
  ACTION_ELEMENT_CODE,
} from '@/components/daniels-elements/elements/interactive-elements';
import {
  TeamMemberCard,
  InfoElement,
  NumberCounter,
  MembershipCard,
  UserInitialsAvatar,
  TEAM_MEMBER_CARD_CODE,
  INFO_ELEMENT_CODE,
  NUMBER_COUNTER_CODE,
  MEMBERSHIP_CARD_CODE,
  USER_INITIALS_AVATAR_CODE,
} from '@/components/daniels-elements/elements/specialized-elements';
import {
  UploadButtonShowcase,
  UploadCardShowcase,
  UPLOAD_BUTTON_CODE,
  UPLOAD_CARD_CODE,
} from '@/components/daniels-elements/elements/upload-elements';
import PageTitle from '@/components/layouts/page-title';

export default function DanielsElementsPage() {
  return (
    <>
      {/* Skip to content link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
      >
        Skip to content
      </a>

      <PageTitle pillText='Components' pageTitle='All Elements' pageTitleHighlighted='' description='A comprehensive showcase of reusable UI components. Preview and copy code for any element.'/>
      
      <div id="main-content" className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
      
      {/* Typography Elements */}
      <section className="mb-8 sm:mb-10 lg:mb-12" aria-labelledby="typography-heading">
        <h2 id="typography-heading" className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Typography</h2>
        <TypographyElements />
        <div className="mt-4 sm:mt-6">
          <HighlightedTextShowcase />
        </div>
      </section>

      {/* Button Elements */}
      <section className="mb-8 sm:mb-10 lg:mb-12" aria-labelledby="buttons-heading">
        <h2 id="buttons-heading" className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Buttons</h2>
        <div className="space-y-4 sm:space-y-6">
          <ElementCard
            name="Primary Button"
            description="Default button with primary blue background and white text. Used for main CTAs and primary actions."
            code={PRIMARY_BUTTON_CODE}
          >
            <PrimaryButton />
          </ElementCard>

          <ElementCard
            name="Outline Button"
            description="Button with transparent background and theme-aware border. Inverts colors on hover."
            code={OUTLINE_BUTTON_CODE}
          >
            <OutlineButton />
          </ElementCard>

          <ElementCard
            name="Outline Icon Button"
            description="Icon-only button (40x40px) with outline styling. Perfect for social links and icon actions."
            code={OUTLINE_ICON_BUTTON_CODE}
          >
            <OutlineIconButton />
          </ElementCard>

          <ElementCard
            name="Secondary Button"
            description="White background button with dark text. Designed for use on dark or colored backgrounds."
            code={SECONDARY_BUTTON_CODE}
          >
            <SecondaryButton />
          </ElementCard>

          <ElementCard
            name="Ghost Icon Button (Theme Toggle)"
            description="Transparent button with icon rotation animation. Used for theme switching with smooth transitions."
            code={GHOST_ICON_BUTTON_CODE}
          >
            <GhostIconButton />
          </ElementCard>

          <ElementCard
            name="Transitioned Input Button"
            description="Animated button that shrinks to icon-only (42x42px) when input is focused. Shrinks in 500ms, expands in 400ms."
            code={TRANSITIONED_INPUT_BUTTON_CODE}
          >
            <TransitionedInputButton />
          </ElementCard>
        </div>
      </section>

      {/* Form Elements */}
      <section className="mb-8 sm:mb-10 lg:mb-12" aria-labelledby="forms-heading">
        <h2 id="forms-heading" className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Forms</h2>
        <div className="space-y-4 sm:space-y-6">
          <ElementCard
            name="Input with Integrated Button"
            description="Email input field with animated button that shrinks to icon-only on focus. Features smooth transitions (500ms shrink, 400ms expand) and theme-aware styling."
            code={INPUT_WITH_BUTTON_CODE}
          >
            <InputWithButton />
          </ElementCard>

          <ElementCard
            name="Standard Input Field"
            description="Basic input field with label, placeholder, and focus states. Uses theme-aware colors and proper accessibility attributes."
            code={STANDARD_INPUT_CODE}
          >
            <StandardInput />
          </ElementCard>

          <ElementCard
            name="Complete Form"
            description="Full form example with multiple field types including text input, email, textarea, and checkbox. Includes state management and submit handling."
            code={COMPLETE_FORM_CODE}
          >
            <CompleteForm />
          </ElementCard>

          <ElementCard
            name="Form with Validation"
            description="Login form with real-time validation, error messages, and visual feedback. Validates on blur and shows errors with proper styling."
            code={FORM_WITH_VALIDATION_CODE}
          >
            <FormWithValidation />
          </ElementCard>
        </div>
      </section>

      {/* Card and Container Elements */}
      <section className="mb-8 sm:mb-10 lg:mb-12" aria-labelledby="cards-heading">
        <h2 id="cards-heading" className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Cards & Containers</h2>
        <div className="space-y-4 sm:space-y-6">
          <ElementCard
            name="Empty Card"
            description="Base card structure with rounded corners, border, and padding. Perfect starting point for custom card layouts."
            code={EMPTY_CARD_CODE}
          >
            <EmptyCard />
          </ElementCard>

          <ElementCard
            name="Image with Offset Background"
            description="Image container with a colored offset background layer. Creates a modern depth effect with 20px offset and semi-transparent blue background."
            code={IMAGE_WITH_OFFSET_CODE}
          >
            <ImageWithOffset />
          </ElementCard>

          <ElementCard
            name="Pill Badge"
            description="Rounded pill badge with gradient blue background and white border. Perfect for labels, tags, and status indicators."
            code={PILL_BADGE_CODE}
          >
            <PillBadge text="Put Your Text Here" />
          </ElementCard>

          <ElementCard
            name="Testimonial Card"
            description="Complete testimonial card with quote, person info (photo, name, position), divider, and metric display. Features semi-transparent blue background."
            code={TESTIMONIAL_CARD_CODE}
          >
            <TestimonialCard />
          </ElementCard>

          <ElementCard
            name="Pricing Card"
            description="Full-featured pricing card with optional badge, plan name, description, price display, feature list with checkmarks, and CTA button."
            code={PRICING_CARD_CODE}
          >
            <PricingCard />
          </ElementCard>
        </div>
      </section>

      {/* Interactive Elements */}
      <section className="mb-8 sm:mb-10 lg:mb-12" aria-labelledby="interactive-heading">
        <h2 id="interactive-heading" className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Interactive Elements</h2>
        <div className="space-y-4 sm:space-y-6">
          <ElementCard
            name="Toggle Switch"
            description="Accessible toggle switch with smooth animation and theme-aware styling. Changes color when enabled and includes proper ARIA attributes."
            code={TOGGLE_SWITCH_CODE}
          >
            <ToggleSwitch />
          </ElementCard>

          <ElementCard
            name="Accordion"
            description="Expandable/collapsible content panel with smooth height animation (300ms). Features rotating chevron icon and theme-aware styling."
            code={ACCORDION_CODE}
          >
            <Accordion />
          </ElementCard>

          <ElementCard
            name="Action Element"
            description="Interactive link card with icon, title, and description. Features hover animation that fills the icon background with primary color and changes title color."
            code={ACTION_ELEMENT_CODE}
          >
            <ActionElementShowcase />
          </ElementCard>
        </div>
      </section>

      {/* Specialized Components */}
      <section className="mb-8 sm:mb-10 lg:mb-12" aria-labelledby="specialized-heading">
        <h2 id="specialized-heading" className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Specialized Components</h2>
        <div className="space-y-4 sm:space-y-6">
          <ElementCard
            name="Team Member Card"
            description="Complete team member card with profile image, name, position, and email button. Features hover animation that changes background to primary blue and inverts text colors."
            code={TEAM_MEMBER_CARD_CODE}
          >
            <TeamMemberCard />
          </ElementCard>

          <ElementCard
            name="Info Element (Icon + Title + Text)"
            description="Information display component with icon container, title, and description. Icon has semi-transparent blue background. Perfect for feature lists and about sections."
            code={INFO_ELEMENT_CODE}
          >
            <InfoElement />
          </ElementCard>

          <ElementCard
            name="Number Counter"
            description="Statistic display with large number, plus symbol, and label. Features primary blue color for numbers and semi-transparent background. Used for metrics and achievements."
            code={NUMBER_COUNTER_CODE}
          >
            <NumberCounter />
          </ElementCard>

          <ElementCard
            name="Membership Card"
            description="Compact membership display card showing plan image, plan name, and expiry date. Used in dashboard sidebar to show current subscription status."
            code={MEMBERSHIP_CARD_CODE}
          >
            <MembershipCard />
          </ElementCard>

          <ElementCard
            name="User Initials Avatar"
            description="Circular avatar displaying user initials with primary blue background. Available in multiple sizes (8, 12, 16). Used for user identification throughout the app."
            code={USER_INITIALS_AVATAR_CODE}
          >
            <UserInitialsAvatar />
          </ElementCard>
        </div>
      </section>

      {/* File Upload Elements */}
      <section className="mb-8 sm:mb-10 lg:mb-12" aria-labelledby="upload-heading">
        <h2 id="upload-heading" className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">File Upload</h2>
        <div className="space-y-4 sm:space-y-6">
          <ElementCard
            name="Upload Button"
            description="Simple upload button with file selection. Supports optimization rules, file type restrictions, and loading states. Perfect for quick file uploads with minimal UI."
            code={UPLOAD_BUTTON_CODE}
          >
            <UploadButtonShowcase />
          </ElementCard>

          <ElementCard
            name="Upload Card"
            description="Complete upload interface with drag-and-drop, file preview, and progress tracking. Configurable optimization and validation. Ideal for rich upload experiences."
            code={UPLOAD_CARD_CODE}
          >
            <UploadCardShowcase />
          </ElementCard>
        </div>
      </section>
      </div>
    </>
  );
}
