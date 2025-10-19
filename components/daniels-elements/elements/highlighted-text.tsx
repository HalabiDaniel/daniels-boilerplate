'use client';

import { ElementCard } from '../element-card';

// Code template for HighlightedText
const HIGHLIGHTED_TEXT_CODE = `<span className="underline decoration-2 text-highlighted-text">
  highlighted text
</span>`;

export function HighlightedText({ children }: { children: React.ReactNode }) {
  return (
    <span className="underline decoration-2 text-highlighted-text">
      {children}
    </span>
  );
}

export function HighlightedTextShowcase() {
  return (
    <ElementCard
      name="Highlighted Text"
      description="Primary blue text with underline decoration. Works as an inline span element that inherits parent font properties."
      code={HIGHLIGHTED_TEXT_CODE}
    >
      <div className="space-y-6">
        {/* Example in H1 */}
        <h1
          className="font-semibold text-3xl md:text-[52px] md:leading-[62px] text-foreground"
          style={{
            letterSpacing: '-1.35px'
          }}
        >
          This is a <HighlightedText>highlighted</HighlightedText> heading
        </h1>

        {/* Example in H2 */}
        <h2 className="text-2xl md:text-4xl font-semibold text-foreground">
          Subheading with <HighlightedText>accent text</HighlightedText>
        </h2>

        {/* Example in paragraph */}
        <p className="text-base md:text-[16px] md:leading-[28px] font-normal text-muted-foreground dark:text-foreground">
          This is a paragraph with <HighlightedText>highlighted words</HighlightedText> that demonstrate the underlined effect in body text.
        </p>
      </div>
    </ElementCard>
  );
}
