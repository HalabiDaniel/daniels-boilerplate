'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

// Input with Integrated Button (from hero-1.tsx)
export function InputWithButton() {
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [email, setEmail] = useState('');
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        console.log('Email submitted:', email);
      }}
      className="w-full max-w-[450px] bg-[oklch(0.922_0_0)] dark:bg-[#262626] rounded-xl p-1.5 flex items-center gap-1"
    >
      <input
        type="email"
        placeholder="Add your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 bg-transparent px-3 py-2 text-sm text-[#262626] dark:text-white placeholder:text-[#262626] dark:placeholder:text-white/70 outline-none"
        onFocus={() => setIsInputFocused(true)}
        onBlur={() => setIsInputFocused(false)}
      />
      <Button
        ref={buttonRef}
        type="submit"
        className="shrink-0 overflow-hidden h-[42px] flex items-center justify-center text-sm relative text-white"
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

// Standard Input Field
export function StandardInput() {
  const [value, setValue] = useState('');

  return (
    <div className="w-full max-w-[450px]">
      <label htmlFor="standard-input" className="block text-sm font-medium mb-2">
        Email Address
      </label>
      <input
        id="standard-input"
        type="email"
        placeholder="Enter your email"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full px-4 py-2.5 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-all"
      />
    </div>
  );
}

// Complete Form Example
export function CompleteForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    subscribe: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[450px] space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-2">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="John Doe"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-2.5 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-all"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="john@example.com"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2.5 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-all"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-2">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          placeholder="Your message here..."
          value={formData.message}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2.5 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-all resize-none"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          id="subscribe"
          name="subscribe"
          type="checkbox"
          checked={formData.subscribe}
          onChange={handleChange}
          className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-ring"
        />
        <label htmlFor="subscribe" className="text-sm">
          Subscribe to newsletter
        </label>
      </div>

      <Button type="submit" className="w-full">
        Submit
      </Button>
    </form>
  );
}

// Form with Validation
export function FormWithValidation() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const validateEmail = (email: string) => {
    if (!email) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Invalid email format';
    return '';
  };

  const validatePassword = (password: string) => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validate on change if field has been touched
    if (touched[name as keyof typeof touched]) {
      const error =
        name === 'email' ? validateEmail(value) : validatePassword(value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    const error =
      name === 'email' ? validateEmail(value) : validatePassword(value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    setErrors({ email: emailError, password: passwordError });
    setTouched({ email: true, password: true });

    if (!emailError && !passwordError) {
      console.log('Form is valid:', formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[450px] space-y-4">
      <div>
        <label htmlFor="val-email" className="block text-sm font-medium mb-2">
          Email
        </label>
        <input
          id="val-email"
          name="email"
          type="email"
          placeholder="john@example.com"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={touched.email && !!errors.email}
          className={`w-full px-4 py-2.5 rounded-md border bg-background text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring transition-all ${
            touched.email && errors.email
              ? 'border-destructive focus:border-destructive focus:ring-destructive/20'
              : 'border-border focus:border-ring'
          }`}
        />
        {touched.email && errors.email && (
          <p className="text-sm text-destructive mt-1">{errors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="val-password" className="block text-sm font-medium mb-2">
          Password
        </label>
        <input
          id="val-password"
          name="password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={touched.password && !!errors.password}
          className={`w-full px-4 py-2.5 rounded-md border bg-background text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring transition-all ${
            touched.password && errors.password
              ? 'border-destructive focus:border-destructive focus:ring-destructive/20'
              : 'border-border focus:border-ring'
          }`}
        />
        {touched.password && errors.password && (
          <p className="text-sm text-destructive mt-1">{errors.password}</p>
        )}
      </div>

      <Button type="submit" className="w-full">
        Sign In
      </Button>
    </form>
  );
}

// Code templates for copying
export const INPUT_WITH_BUTTON_CODE = `'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function InputWithButton() {
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [email, setEmail] = useState('');
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        console.log('Email submitted:', email);
      }}
      className="w-full max-w-[450px] bg-[oklch(0.922_0_0)] dark:bg-[#262626] rounded-xl p-1.5 flex items-center gap-1"
    >
      <input
        type="email"
        placeholder="Add your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 bg-transparent px-3 py-2 text-sm text-[#262626] dark:text-white placeholder:text-[#262626] dark:placeholder:text-white/70 outline-none"
        onFocus={() => setIsInputFocused(true)}
        onBlur={() => setIsInputFocused(false)}
      />
      <Button
        ref={buttonRef}
        type="submit"
        className="shrink-0 overflow-hidden h-[42px] flex items-center justify-center text-sm relative text-white"
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

export const STANDARD_INPUT_CODE = `'use client';

import { useState } from 'react';

export function StandardInput() {
  const [value, setValue] = useState('');

  return (
    <div className="w-full max-w-[450px]">
      <label htmlFor="standard-input" className="block text-sm font-medium mb-2">
        Email Address
      </label>
      <input
        id="standard-input"
        type="email"
        placeholder="Enter your email"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full px-4 py-2.5 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-all"
      />
    </div>
  );
}`;

export const COMPLETE_FORM_CODE = `'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function CompleteForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    subscribe: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[450px] space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-2">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="John Doe"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-2.5 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-all"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="john@example.com"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2.5 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-all"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-2">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          placeholder="Your message here..."
          value={formData.message}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2.5 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-all resize-none"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          id="subscribe"
          name="subscribe"
          type="checkbox"
          checked={formData.subscribe}
          onChange={handleChange}
          className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-ring"
        />
        <label htmlFor="subscribe" className="text-sm">
          Subscribe to newsletter
        </label>
      </div>

      <Button type="submit" className="w-full">
        Submit
      </Button>
    </form>
  );
}`;

export const FORM_WITH_VALIDATION_CODE = `'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function FormWithValidation() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const validateEmail = (email: string) => {
    if (!email) return 'Email is required';
    if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) return 'Invalid email format';
    return '';
  };

  const validatePassword = (password: string) => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name as keyof typeof touched]) {
      const error =
        name === 'email' ? validateEmail(value) : validatePassword(value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    const error =
      name === 'email' ? validateEmail(value) : validatePassword(value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    setErrors({ email: emailError, password: passwordError });
    setTouched({ email: true, password: true });

    if (!emailError && !passwordError) {
      console.log('Form is valid:', formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[450px] space-y-4">
      <div>
        <label htmlFor="val-email" className="block text-sm font-medium mb-2">
          Email
        </label>
        <input
          id="val-email"
          name="email"
          type="email"
          placeholder="john@example.com"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={touched.email && !!errors.email}
          className={\`w-full px-4 py-2.5 rounded-md border bg-background text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring transition-all \${
            touched.email && errors.email
              ? 'border-destructive focus:border-destructive focus:ring-destructive/20'
              : 'border-border focus:border-ring'
          }\`}
        />
        {touched.email && errors.email && (
          <p className="text-sm text-destructive mt-1">{errors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="val-password" className="block text-sm font-medium mb-2">
          Password
        </label>
        <input
          id="val-password"
          name="password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={touched.password && !!errors.password}
          className={\`w-full px-4 py-2.5 rounded-md border bg-background text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring transition-all \${
            touched.password && errors.password
              ? 'border-destructive focus:border-destructive focus:ring-destructive/20'
              : 'border-border focus:border-ring'
          }\`}
        />
        {touched.password && errors.password && (
          <p className="text-sm text-destructive mt-1">{errors.password}</p>
        )}
      </div>

      <Button type="submit" className="w-full">
        Sign In
      </Button>
    </form>
  );
}`;
