'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface CopyButtonProps {
  code: string;
  elementName: string;
}

export function CopyButton({ code, elementName }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      // Try modern clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(code);
        handleCopySuccess();
      } else {
        // Fallback to execCommand for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = code;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (successful) {
          handleCopySuccess();
        } else {
          throw new Error('Copy command failed');
        }
      }
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error(`Failed to copy ${elementName} code`, {
        description: 'Please try again or copy manually.',
      });
    }
  };

  const handleCopySuccess = () => {
    setCopied(true);
    toast.success(`${elementName} code copied!`, {
      description: 'Paste it into your project.',
    });
    
    // Reset icon after 2 seconds
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={copyToClipboard}
      aria-label={`Copy ${elementName} code to clipboard`}
      className="shrink-0"
    >
      {copied ? (
        <Check className="size-4" />
      ) : (
        <Copy className="size-4" />
      )}
    </Button>
  );
}
