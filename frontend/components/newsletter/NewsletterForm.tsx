'use client';

import React, { useState, FormEvent } from 'react';
import { Mail, Send, Check } from 'lucide-react';

interface NewsletterFormProps {
  className?: string;
  onSuccess?: (email: string) => void;
  onError?: (error: string) => void;
}

export default function NewsletterForm({
  className = '',
  onSuccess,
  onError,
}: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('Successfully subscribed!');
        onSuccess?.(email);
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Subscription failed');
        onError?.(data.error);
      }
    } catch (error) {
      setStatus('error');
      setMessage('An error occurred. Please try again.');
      onError?.('Network error');
    }
  };

  return (
    <div className={`newsletter-form ${className}`}>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            disabled={status === 'loading' || status === 'success'}
            className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-cyber-cyan/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyber-cyan/50 disabled:opacity-50"
          />
        </div>
        <button
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          className="px-6 py-3 bg-gradient-to-r from-cyber-purple to-cyber-cyan text-white rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {status === 'loading' ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              Subscribing...
            </>
          ) : status === 'success' ? (
            <>
              <Check className="w-4 h-4" />
              Subscribed!
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Subscribe
            </>
          )}
        </button>
      </form>

      {message && (
        <p
          className={`mt-2 text-sm ${
            status === 'success' ? 'text-green-400' : 'text-red-400'
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
