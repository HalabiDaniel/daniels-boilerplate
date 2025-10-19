'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Github, Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from 'next-themes';

// Code templates for each button variant
export const PRIMARY_BUTTON_CODE = `import { Button } from '@/components/ui/button';

export default function PrimaryButtonExample() {
  return (
    <Button className="text-primary-foreground hover:bg-foreground hover:text-muted dark:hover:bg-background dark:hover:text-foreground">
      Click me
    </Button>
  );
}`;

export const OUTLINE_BUTTON_CODE = `import { Button } from '@/components/ui/button';

export default function OutlineButtonExample() {
  return (
    <Button 
      variant="outline" 
      className="border-2 border-foreground text-foreground shadow-none hover:bg-foreground hover:text-muted dark:hover:bg-background dark:hover:text-foreground"
    >
      Dashboard
    </Button>
  );
}`;

export const OUTLINE_ICON_BUTTON_CODE = `import { Button } from '@/components/ui/button';
import { Github } from 'lucide-react';

export default function OutlineIconButtonExample() {
  return (
    <Button
      variant="outline"
      size="icon"
      className="bg-transparent border-2 border-foreground text-foreground shadow-none hover:bg-foreground hover:text-muted dark:hover:bg-background dark:hover:text-foreground"
    >
      <Github className="h-4 w-4" />
    </Button>
  );
}`;

export const SECONDARY_BUTTON_CODE = `import { Button } from '@/components/ui/button';

export default function SecondaryButtonExample() {
  return (
    <Button className="bg-card text-foreground hover:bg-foreground hover:text-background dark:hover:bg-foreground dark:hover:text-background">
      Get Started
    </Button>
  );
}`;

export const GHOST_ICON_BUTTON_CODE = `'use client';

import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function ThemeToggleExample() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
}`;

export const TRANSITIONED_INPUT_BUTTON_CODE = `'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function TransitionedInputButtonExample() {
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [email, setEmail] = useState('');

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        console.log('Submitted:', email);
      }}
      className="w-full max-w-[450px] bg-accent dark:bg-secondary rounded-xl p-1.5 flex items-center gap-1"
    >
      <input
        type="email"
        placeholder="Add your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-foreground/70 outline-none"
        onFocus={() => setIsInputFocused(true)}
        onBlur={() => setIsInputFocused(false)}
      />
      <Button
        type="submit"
        className="shrink-0 overflow-hidden h-[42px] flex items-center justify-center text-sm relative text-primary-foreground hover:bg-foreground hover:text-muted dark:hover:bg-background dark:hover:text-foreground"
        style={{
          width: isInputFocused ? '42px' : 'auto',
          paddingLeft: isInputFocused ? '0' : '24px',
          paddingRight: isInputFocused ? '0' : '24px',
          transition: isInputFocused
            ? 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1), padding 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
            : 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1), padding 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <span
          className="absolute inset-0 flex items-center justify-center"
          style={{
            opacity: isInputFocused ? 1 : 0,
            transition: isInputFocused ? 'opacity 0.15s ease-in-out 0.1s' : 'opacity 0s'
          }}
        >
          <ArrowRight className="h-4 w-4" />
        </span>
        <span
          className="whitespace-nowrap"
          style={{
            opacity: isInputFocused ? 0 : 1,
            transition: isInputFocused ? 'opacity 0s' : 'opacity 0.15s ease-in-out 0.1s'
          }}
        >
          Get Started
        </span>
      </Button>
    </form>
  );
}`;

// Component showcases
export function PrimaryButton() {
  return (
    <Button className="text-primary-foreground hover:bg-foreground hover:text-muted dark:hover:bg-background dark:hover:text-foreground">
      Click me
    </Button>
  );
}

export function OutlineButton() {
  return (
    <Button 
      variant="outline" 
      className="border-2 border-foreground text-foreground shadow-none hover:bg-foreground hover:text-muted dark:hover:bg-background dark:hover:text-foreground"
    >
      Dashboard
    </Button>
  );
}

export function OutlineIconButton() {
  return (
    <Button
      variant="outline"
      size="icon"
      className="bg-transparent border-2 border-foreground text-foreground shadow-none hover:bg-foreground hover:text-muted dark:hover:bg-background dark:hover:text-foreground"
    >
      <Github className="h-4 w-4" />
    </Button>
  );
}

export function SecondaryButton() {
  return (
    <div className="bg-primary p-8 rounded-lg">
      <Button className="bg-card text-foreground hover:bg-foreground hover:text-background dark:hover:bg-foreground dark:hover:text-background">
        Get Started
      </Button>
    </div>
  );
}

export function GhostIconButton() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
}

export function TransitionedInputButton() {
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [email, setEmail] = useState('');

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        console.log('Submitted:', email);
      }}
      className="w-full max-w-[450px] bg-accent dark:bg-secondary rounded-xl p-1.5 flex items-center gap-1"
    >
      <input
        type="email"
        placeholder="Add your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-foreground/70 outline-none"
        onFocus={() => setIsInputFocused(true)}
        onBlur={() => setIsInputFocused(false)}
      />
      <Button
        type="submit"
        className="shrink-0 overflow-hidden h-[42px] flex items-center justify-center text-sm relative text-primary-foreground hover:bg-foreground hover:text-muted dark:hover:bg-background dark:hover:text-foreground"
        style={{
          width: isInputFocused ? '42px' : 'auto',
          paddingLeft: isInputFocused ? '0' : '24px',
          paddingRight: isInputFocused ? '0' : '24px',
          transition: isInputFocused
            ? 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1), padding 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
            : 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1), padding 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <span
          className="absolute inset-0 flex items-center justify-center"
          style={{
            opacity: isInputFocused ? 1 : 0,
            transition: isInputFocused ? 'opacity 0.15s ease-in-out 0.1s' : 'opacity 0s'
          }}
        >
          <ArrowRight className="h-4 w-4" />
        </span>
        <span
          className="whitespace-nowrap"
          style={{
            opacity: isInputFocused ? 0 : 1,
            transition: isInputFocused ? 'opacity 0s' : 'opacity 0.15s ease-in-out 0.1s'
          }}
        >
          Get Started
        </span>
      </Button>
    </form>
  );
}
