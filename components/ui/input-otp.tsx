'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface InputOTPProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function InputOTP({ length = 6, value, onChange, disabled }: InputOTPProps) {
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, digit: string) => {
    // Only allow digits
    if (digit && !/^\d$/.test(digit)) return;

    const newValue = value.split('');
    newValue[index] = digit;
    const updatedValue = newValue.join('');
    onChange(updatedValue);

    // Auto-focus next input
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, length);
    if (/^\d+$/.test(pastedData)) {
      onChange(pastedData);
      // Focus the last filled input or the next empty one
      const nextIndex = Math.min(pastedData.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <div className="flex gap-2 justify-center items-center">
      {Array.from({ length }).map((_, index) => (
        <React.Fragment key={index}>
          <input
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value[index] || ''}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={disabled}
            className={cn(
              'h-9 w-9 md:h-12 md:w-12 text-center text-sm md:text-lg font-semibold rounded-md border-0 focus:ring-0',
              'bg-white/20 text-white',
              'focus-visible:outline-none',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'transition-all'
            )}
          />
          {index === 2 && (
            <span className="text-white dark:text-white/70 text-lg font-semibold px-1">
              -
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
