'use client';

import { ElementCard } from '../element-card';

// Code templates for each typography element
const H1_CODE = `<h1
  className="font-semibold text-3xl md:text-[52px] md:leading-[62px] text-[oklch(0.145_0_0)] dark:text-white"
  style={{
    letterSpacing: '-1.35px'
  }}
>
  Your Main Heading
</h1>`;

const H2_CODE = `<h2 className="text-2xl md:text-4xl font-semibold text-[oklch(0.145_0_0)] dark:text-white">
  Your Subheading
</h2>`;

const H3_CODE = `<h3 className="text-xl md:text-3xl font-semibold text-[oklch(0.145_0_0)] dark:text-white">
  Section Heading
</h3>`;

const H4_CODE = `<h4 className="text-lg md:text-2xl font-semibold text-[oklch(0.145_0_0)] dark:text-white">
  Subsection Heading
</h4>`;

const H5_CODE = `<h5 className="text-base md:text-xl font-semibold text-[oklch(0.145_0_0)] dark:text-white">
  Minor Heading
</h5>`;

const H6_CODE = `<h6 className="text-sm md:text-lg font-semibold text-[oklch(0.145_0_0)] dark:text-white">
  Small Heading
</h6>`;

const PARAGRAPH_CODE = `<p className="text-base md:text-[16px] md:leading-[28px] font-normal text-[#404040] dark:text-white">
  Your paragraph text goes here. This is the standard body text style used throughout the application.
</p>`;

const ORDERED_LIST_CODE = `<ol className="list-decimal list-inside space-y-2 text-base text-[#404040] dark:text-white">
  <li>First item in the list</li>
  <li>Second item in the list</li>
  <li>Third item in the list</li>
</ol>`;

const UNORDERED_LIST_CODE = `<ul className="list-disc list-inside space-y-2 text-base text-[#404040] dark:text-white">
  <li>First bullet point</li>
  <li>Second bullet point</li>
  <li>Third bullet point</li>
</ul>`;

export function TypographyElements() {
  return (
    <div className="space-y-6">
      <ElementCard
        name="H1 Heading"
        description="Main page heading with proper letter spacing and responsive sizing. Used for hero sections and primary page titles."
        code={H1_CODE}
      >
        <h1
          className="font-semibold text-3xl md:text-[52px] md:leading-[62px] text-[oklch(0.145_0_0)] dark:text-white"
          style={{
            letterSpacing: '-1.35px'
          }}
        >
          Your Main Heading
        </h1>
      </ElementCard>

      <ElementCard
        name="H2 Heading"
        description="Secondary heading for major sections. Slightly smaller than H1 with consistent styling."
        code={H2_CODE}
      >
        <h2 className="text-2xl md:text-4xl font-semibold text-[oklch(0.145_0_0)] dark:text-white">
          Your Subheading
        </h2>
      </ElementCard>

      <ElementCard
        name="H3 Heading"
        description="Section heading for organizing content into distinct areas."
        code={H3_CODE}
      >
        <h3 className="text-xl md:text-3xl font-semibold text-[oklch(0.145_0_0)] dark:text-white">
          Section Heading
        </h3>
      </ElementCard>

      <ElementCard
        name="H4 Heading"
        description="Subsection heading for breaking down sections into smaller parts."
        code={H4_CODE}
      >
        <h4 className="text-lg md:text-2xl font-semibold text-[oklch(0.145_0_0)] dark:text-white">
          Subsection Heading
        </h4>
      </ElementCard>

      <ElementCard
        name="H5 Heading"
        description="Minor heading for detailed content organization."
        code={H5_CODE}
      >
        <h5 className="text-base md:text-xl font-semibold text-[oklch(0.145_0_0)] dark:text-white">
          Minor Heading
        </h5>
      </ElementCard>

      <ElementCard
        name="H6 Heading"
        description="Smallest heading level for fine-grained content structure."
        code={H6_CODE}
      >
        <h6 className="text-sm md:text-lg font-semibold text-[oklch(0.145_0_0)] dark:text-white">
          Small Heading
        </h6>
      </ElementCard>

      <ElementCard
        name="Paragraph"
        description="Standard body text with proper line height and color. Used for descriptions and content blocks."
        code={PARAGRAPH_CODE}
      >
        <p className="text-base md:text-[16px] md:leading-[28px] font-normal text-[#404040] dark:text-white">
          Your paragraph text goes here. This is the standard body text style used throughout the application.
        </p>
      </ElementCard>

      <ElementCard
        name="Ordered List"
        description="Numbered list with proper spacing and styling for sequential items."
        code={ORDERED_LIST_CODE}
      >
        <ol className="list-decimal list-inside space-y-2 text-base text-[#404040] dark:text-white">
          <li>First item in the list</li>
          <li>Second item in the list</li>
          <li>Third item in the list</li>
        </ol>
      </ElementCard>

      <ElementCard
        name="Unordered List"
        description="Bulleted list with proper spacing and styling for non-sequential items."
        code={UNORDERED_LIST_CODE}
      >
        <ul className="list-disc list-inside space-y-2 text-base text-[#404040] dark:text-white">
          <li>First bullet point</li>
          <li>Second bullet point</li>
          <li>Third bullet point</li>
        </ul>
      </ElementCard>
    </div>
  );
}
