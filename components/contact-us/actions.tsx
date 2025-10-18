'use client';

import React from 'react';
import ActionElement from './action-element';
import { Mail, Phone, MessageCircle } from 'lucide-react';

export default function Actions() {
  const actions = [
    {
      icon: Mail,
      title: 'Email Us',
      description: 'Send us an email and we\'ll respond within 24 hours.',
      href: 'mailto:contact@example.com'
    },
    {
      icon: Phone,
      title: 'Call Us',
      description: 'Give us a call during business hours for immediate assistance.',
      href: 'tel:+1234567890'
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with our support team in real-time for quick answers.',
      href: '#chat'
    }
  ];

  return (
    <section className="w-full">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {actions.map((action, index) => (
            <ActionElement
              key={index}
              icon={action.icon}
              title={action.title}
              description={action.description}
              href={action.href}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
