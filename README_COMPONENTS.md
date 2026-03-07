# CyberPress Platform - Components Quick Start Guide

## 🚀 Getting Started with Cyber UI Components

This guide helps you quickly start using the Cyber UI components in your Next.js application.

## 📦 Installation

All dependencies are already installed in your project. The main packages used are:

- `next@14.2.0` - Next.js framework
- `react@18.2.0` - React library
- `framer-motion@11.0.0` - Animation library
- `tailwindcss@3.4.0` - Styling
- `lucide-react@0.363.0` - Icon library
- `typescript@5.4.0` - Type safety

## 🎨 Available Cyber Components

### Core Components

#### 1. CyberButton
A beautiful, animated button with neon glow effects.

```tsx
import { CyberButton } from '@/components/ui/CyberButton';

<CyberButton variant="primary" size="md" neon="cyan" glow>
  Click Me
</CyberButton>

<CyberButton variant="outline" neon="purple" icon={<Icon />}>
  With Icon
</CyberButton>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success'
- `size`: 'sm' | 'md' | 'lg' | 'xl'
- `neon`: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow'
- `glow`: boolean (default: true)
- `glitch`: boolean (default: false)
- `loading`: boolean
- `icon`: React.ReactNode
- `iconPosition`: 'left' | 'right'

#### 2. CyberCard
A holographic card with tilt effects and corner decorations.

```tsx
import { CyberCard } from '@/components/ui/CyberCard';

<CyberCard variant="hologram" neon="cyan" interactive>
  <div className="p-6">
    <h3 className="text-xl font-bold text-cyan-400">Title</h3>
    <p className="text-gray-400">Card content</p>
  </div>
</CyberCard>
```

**Props:**
- `variant`: 'default' | 'hologram' | 'neon' | 'glass'
- `neon`: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow'
- `interactive`: boolean
- `tilt`: boolean
- `glow`: boolean

#### 3. CyberInput
A futuristic input field with animated borders and glow effects.

```tsx
import { CyberInput } from '@/components/ui/CyberInput';

<CyberInput
  label="Email"
  type="email"
  placeholder="your@email.com"
  variant="neon"
  neon="cyan"
/>
```

**Props:**
- `variant`: 'default' | 'neon' | 'hologram'
- `neon`: 'cyan' | 'purple' | 'pink' | 'green'
- `label`: string
- `error`: string
- `helperText`: string
- `icon`: React.ReactNode
- `glow`: boolean

#### 4. CyberBadge
Small badges with pulse animation support.

```tsx
import { CyberBadge } from '@/components/ui/CyberBadge';

<CyberBadge color="cyan" pulse>
  Live
</CyberBadge>

<CyberBadge color="green" variant="neon">
  Active
</CyberBadge>
```

**Props:**
- `variant`: 'default' | 'neon' | 'hologram' | 'glow'
- `size`: 'sm' | 'md' | 'lg'
- `color`: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow' | 'red'
- `pulse`: boolean

#### 5. CyberModal
A beautiful modal with backdrop blur and animations.

```tsx
import { CyberModal } from '@/components/ui/CyberModal';

<CyberModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Modal Title"
  size="lg"
  variant="hologram"
>
  <p>Modal content goes here</p>
</CyberModal>
```

**Props:**
- `isOpen`: boolean
- `onClose`: () => void
- `title`: string
- `size`: 'sm' | 'md' | 'lg' | 'xl' | 'full'
- `variant`: 'default' | 'neon' | 'hologram'
- `showCloseButton`: boolean
- `closeOnBackdropClick`: boolean
- `closeOnEscape`: boolean

#### 6. CyberText & CyberHeading
Styled text components with glow effects.

```tsx
import { CyberText, CyberHeading } from '@/components/ui/CyberText';

<CyberHeading level={1} color="cyan" glow>
  Welcome to CyberPress
</CyberHeading>

<CyberText size="lg" color="purple">
  Beautiful text with cyberpunk styling
</CyberText>

<CyberText variant="gradient" color="cyan">
  Gradient text effect
</CyberText>
```

**Props:**
- `variant`: 'default' | 'glow' | 'gradient' | 'hologram' | 'neon'
- `color`: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow'
- `size`: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
- `weight`: 'normal' | 'medium' | 'semibold' | 'bold'
- `glow`: boolean

#### 7. CyberDivider
Animated dividers with label support.

```tsx
import { CyberDivider } from '@/components/ui/CyberDivider';

<CyberDivider size="lg" color="cyan" />

<CyberDivider label="Section Title" color="purple" />

<CyberDivider variant="hologram" />
```

**Props:**
- `variant`: 'default' | 'neon' | 'hologram' | 'gradient'
- `color`: 'cyan' | 'purple' | 'pink' | 'green'
- `label`: string
- `size`: 'sm' | 'md' | 'lg'
- `glow`: boolean

## 🎯 Quick Examples

### Form Example

```tsx
'use client';

import { CyberButton } from '@/components/ui/CyberButton';
import { CyberInput } from '@/components/ui/CyberInput';
import { CyberCard } from '@/components/ui/CyberCard';

export function ContactForm() {
  return (
    <CyberCard variant="neon" neon="cyan">
      <form className="space-y-4 p-6">
        <CyberInput
          label="Name"
          placeholder="Your name"
          variant="neon"
          neon="cyan"
        />
        <CyberInput
          label="Email"
          type="email"
          placeholder="your@email.com"
          variant="neon"
          neon="cyan"
        />
        <CyberButton neon="cyan" glow className="w-full">
          Send Message
        </CyberButton>
      </form>
    </CyberCard>
  );
}
```

### Feature Cards Example

```tsx
'use client';

import { CyberCard } from '@/components/ui/CyberCard';
import { CyberBadge } from '@/components/ui/CyberBadge';
import { Zap } from 'lucide-react';

export function FeatureCard() {
  return (
    <CyberCard variant="hologram" neon="purple" interactive>
      <div className="p-6 space-y-4">
        <CyberBadge color="purple" glow>
          <Zap className="w-4 h-4" />
          New Feature
        </CyberBadge>
        <h3 className="text-2xl font-bold text-purple-400">
          Amazing Feature
        </h3>
        <p className="text-gray-400">
          Description of the feature with all its benefits and capabilities.
        </p>
      </div>
    </CyberCard>
  );
}
```

### Hero Section Example

```tsx
'use client';

import { CyberHeading } from '@/components/ui/CyberText';
import { CyberButton } from '@/components/ui/CyberButton';
import { CyberBadge } from '@/components/ui/CyberBadge';
import { GlitchText } from '@/components/effects/GlitchText';
import { Rocket } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="text-center space-y-8">
      <CyberBadge color="cyan" glow>
        v2.0 Now Available
      </CyberBadge>
      <GlitchText text="CyberPress Platform" />
      <CyberHeading level={2} color="cyan" glow>
        Next-Generation Blog Platform
      </CyberHeading>
      <div className="flex gap-4 justify-center">
        <CyberButton size="lg" neon="cyan" icon={<Rocket />}>
          Get Started
        </CyberButton>
        <CyberButton size="lg" variant="outline" neon="purple">
          Learn More
        </CyberButton>
      </div>
    </section>
  );
}
```

## 🎨 Color Options

All components support these neon colors:

- **cyan** - `#00f0ff` (Neon Cyan)
- **purple** - `#9d00ff` (Cyber Purple)
- **pink** - `#ff0080` (Laser Pink)
- **green** - `#00ff88` (Cyber Green)
- **yellow** - `#f0ff00` (Voltage Yellow)

## 📱 Responsive Design

All components are fully responsive and work on:

- Mobile (< 640px)
- Tablet (640px - 1024px)
- Desktop (> 1024px)

## 🔧 TypeScript Support

All components include full TypeScript definitions:

```tsx
import type { CyberButtonProps } from '@/components/ui/CyberButton';

// Full type safety and autocomplete
const props: CyberButtonProps = {
  variant: 'primary',
  size: 'md',
  neon: 'cyan',
  glow: true,
};
```

## 🌐 Live Demo

Visit the demo page to see all components in action:

```
http://localhost:3000/cyber-demo
```

## 📚 Next Steps

1. Explore the demo page: `/cyber-demo`
2. Check component source code in `/components/ui/`
3. Customize colors in `tailwind.config.ts`
4. Add animations with Framer Motion

## 🤝 Contributing

Feel free to customize and extend these components for your needs!

---

**Built with ❤️ using Next.js, TypeScript, and Framer Motion**
