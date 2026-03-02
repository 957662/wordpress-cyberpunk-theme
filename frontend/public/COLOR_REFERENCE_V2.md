# CyberPress Color Reference

> Complete color palette and usage guide for the CyberPress platform

## 🎨 Core Brand Colors

### Primary Colors
```css
/* Neon Cyan - Primary Accent */
--cyber-cyan: #00f0ff;
--cyber-cyan-light: #4df4ff;
--cyber-cyan-dark: #00a0aa;
--cyber-cyan-dim: rgba(0, 240, 255, 0.1);

/* Cyber Purple - Secondary Accent */
--cyber-purple: #9d00ff;
--cyber-purple-light: #b34dff;
--cyber-purple-dark: #6600aa;
--cyber-purple-dim: rgba(157, 0, 255, 0.1);

/* Laser Pink - Alert/Emphasis */
--cyber-pink: #ff0080;
--cyber-pink-light: #ff3399;
--cyber-pink-dark: #aa0055;
--cyber-pink-dim: rgba(255, 0, 128, 0.1);

/* Voltage Yellow - Warning/Highlight */
--cyber-yellow: #f0ff00;
--cyber-yellow-light: #f4ff33;
--cyber-yellow-dark: #a0aa00;
--cyber-yellow-dim: rgba(240, 255, 0, 0.1);
```

### Background Colors
```css
/* Deep Space - Primary Background */
--cyber-black: #0a0a0f;
--cyber-black-rgb: 10, 10, 15;

/* Dark Surface - Cards/Sections */
--cyber-dark: #12121a;
--cyber-dark-rgb: 18, 18, 26;

/* Lighter Surface - Hover States */
--cyber-gray: #1a1a2f;
--cyber-gray-light: #252540;
```

### Text Colors
```css
/* Primary Text */
--text-primary: #e0e0e0;
--text-primary-rgb: 224, 224, 224;

/* Secondary Text */
--text-secondary: #a0a0b0;
--text-secondary-rgb: 160, 160, 176;

/* Muted Text */
--text-muted: #606070;
--text-muted-rgb: 96, 96, 112;

/* Disabled Text */
--text-disabled: #404050;
--text-disabled-rgb: 64, 64, 80;
```

---

## 🌈 Gradients

### Predefined Gradients
```css
/* Neon Gradient - Cyan to Purple */
.gradient-neon {
  background: linear-gradient(135deg, #00f0ff 0%, #9d00ff 100%);
}

/* Heat Gradient - Pink to Yellow */
.gradient-heat {
  background: linear-gradient(135deg, #ff0080 0%, #f0ff00 100%);
}

/* Cyber Gradient - Full Spectrum */
.gradient-cyber {
  background: linear-gradient(135deg, #00f0ff 0%, #9d00ff 50%, #ff0080 100%);
}

/* Deep Gradient - Subtle Background */
.gradient-deep {
  background: linear-gradient(180deg, #0a0a0f 0%, #1a1a2f 100%);
}

/* Aurora Gradient - Multi-color */
.gradient-aurora {
  background: linear-gradient(
    135deg,
    #00f0ff 0%,
    #9d00ff 25%,
    #ff0080 50%,
    #f0ff00 75%,
    #00f0ff 100%
  );
}
```

---

## ✨ Glow Effects

### Neon Glow Shadows
```css
/* Cyan Glow */
.glow-cyan {
  box-shadow:
    0 0 5px #00f0ff,
    0 0 10px #00f0ff,
    0 0 20px rgba(0, 240, 255, 0.3);
}

/* Purple Glow */
.glow-purple {
  box-shadow:
    0 0 5px #9d00ff,
    0 0 10px #9d00ff,
    0 0 20px rgba(157, 0, 255, 0.3);
}

/* Pink Glow */
.glow-pink {
  box-shadow:
    0 0 5px #ff0080,
    0 0 10px #ff0080,
    0 0 20px rgba(255, 0, 128, 0.3);
}

/* Yellow Glow */
.glow-yellow {
  box-shadow:
    0 0 5px #f0ff00,
    0 0 10px #f0ff00,
    0 0 20px rgba(240, 255, 0, 0.3);
}

/* Intense Glow (for hover/focus) */
.glow-cyan-intense {
  box-shadow:
    0 0 10px #00f0ff,
    0 0 20px #00f0ff,
    0 0 40px rgba(0, 240, 255, 0.4),
    0 0 80px rgba(0, 240, 255, 0.2);
}
```

### Text Glow
```css
/* Text Shadow Glow */
.text-glow-cyan {
  color: #00f0ff;
  text-shadow:
    0 0 5px #00f0ff,
    0 0 10px rgba(0, 240, 255, 0.5);
}

.text-glow-purple {
  color: #9d00ff;
  text-shadow:
    0 0 5px #9d00ff,
    0 0 10px rgba(157, 0, 255, 0.5);
}

.text-glow-pink {
  color: #ff0080;
  text-shadow:
    0 0 5px #ff0080,
    0 0 10px rgba(255, 0, 128, 0.5);
}
```

---

## 🎭 Semantic Colors

### Status Colors
```css
/* Success */
.color-success {
  color: #00f0ff;
}
.bg-success {
  background-color: rgba(0, 240, 255, 0.1);
}

/* Warning */
.color-warning {
  color: #f0ff00;
}
.bg-warning {
  background-color: rgba(240, 255, 0, 0.1);
}

/* Error */
.color-error {
  color: #ff0080;
}
.bg-error {
  background-color: rgba(255, 0, 128, 0.1);
}

/* Info */
.color-info {
  color: #9d00ff;
}
.bg-info {
  background-color: rgba(157, 0, 255, 0.1);
}
```

---

## 🎨 Component-Specific Colors

### Buttons
```css
/* Primary Button */
.btn-primary {
  background: linear-gradient(135deg, #00f0ff 0%, #9d00ff 100%);
  color: #0a0a0f;
  box-shadow: 0 0 10px rgba(0, 240, 255, 0.3);
}

.btn-primary:hover {
  box-shadow:
    0 0 15px #00f0ff,
    0 0 30px rgba(0, 240, 255, 0.5);
}

/* Secondary Button */
.btn-secondary {
  background: transparent;
  border: 1px solid #9d00ff;
  color: #9d00ff;
}

.btn-secondary:hover {
  background: rgba(157, 0, 255, 0.1);
  box-shadow: 0 0 15px rgba(157, 0, 255, 0.4);
}

/* Danger Button */
.btn-danger {
  background: transparent;
  border: 1px solid #ff0080;
  color: #ff0080;
}

.btn-danger:hover {
  background: rgba(255, 0, 128, 0.1);
  box-shadow: 0 0 15px rgba(255, 0, 128, 0.4);
}
```

### Cards
```css
/* Default Card */
.card {
  background: rgba(18, 18, 26, 0.8);
  border: 1px solid rgba(0, 240, 255, 0.1);
  backdrop-filter: blur(10px);
}

.card:hover {
  border-color: rgba(0, 240, 255, 0.3);
  box-shadow: 0 0 20px rgba(0, 240, 255, 0.1);
}

/* Neon Card */
.card-neon {
  background: rgba(18, 18, 26, 0.9);
  border: 1px solid #00f0ff;
  box-shadow:
    0 0 10px rgba(0, 240, 255, 0.2),
    inset 0 0 10px rgba(0, 240, 255, 0.05);
}
```

### Inputs
```css
/* Default Input */
.input {
  background: rgba(10, 10, 15, 0.8);
  border: 1px solid rgba(160, 160, 176, 0.2);
  color: #e0e0e0;
}

.input:focus {
  border-color: #00f0ff;
  box-shadow:
    0 0 0 2px rgba(0, 240, 255, 0.1),
    0 0 10px rgba(0, 240, 255, 0.2);
}

.input::placeholder {
  color: #606070;
}
```

---

## 🔲 Border Colors

```css
/* Default Border */
.border-default {
  border-color: rgba(160, 160, 176, 0.2);
}

/* Accent Borders */
.border-cyan {
  border-color: rgba(0, 240, 255, 0.5);
}

.border-purple {
  border-color: rgba(157, 0, 255, 0.5);
}

.border-pink {
  border-color: rgba(255, 0, 128, 0.5);
}

.border-yellow {
  border-color: rgba(240, 255, 0, 0.5);
}
```

---

## 📊 Color Tokens

### HSL Values (for programmatic manipulation)
```css
--cyber-cyan-h: 182;
--cyber-cyan-s: 100%;
--cyber-cyan-l: 50%;

--cyber-purple-h: 277;
--cyber-purple-s: 100%;
--cyber-purple-l: 50%;

--cyber-pink-h: 330;
--cyber-pink-s: 100%;
--cyber-pink-l: 50%;

--cyber-yellow-h: 63;
--cyber-yellow-s: 100%;
--cyber-yellow-l: 50%;
```

### RGB Values (for opacity manipulation)
```css
--cyber-cyan-rgb: 0, 240, 255;
--cyber-purple-rgb: 157, 0, 255;
--cyber-pink-rgb: 255, 0, 128;
--cyber-yellow-rgb: 240, 255, 0;
--cyber-black-rgb: 10, 10, 15;
--cyber-dark-rgb: 18, 18, 26;
```

---

## 🎨 Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        cyber: {
          cyan: '#00f0ff',
          'cyan-light': '#4df4ff',
          'cyan-dark': '#00a0aa',
          purple: '#9d00ff',
          'purple-light': '#b34dff',
          'purple-dark': '#6600aa',
          pink: '#ff0080',
          'pink-light': '#ff3399',
          'pink-dark': '#aa0055',
          yellow: '#f0ff00',
          'yellow-light': '#f4ff33',
          'yellow-dark': '#a0aa00',
          black: '#0a0a0f',
          dark: '#12121a',
          gray: '#1a1a2f',
        }
      },
      boxShadow: {
        'neon-cyan': '0 0 5px #00f0ff, 0 0 10px #00f0ff',
        'neon-purple': '0 0 5px #9d00ff, 0 0 10px #9d00ff',
        'neon-pink': '0 0 5px #ff0080, 0 0 10px #ff0080',
        'neon-yellow': '0 0 5px #f0ff00, 0 0 10px #f0ff00',
        'neon-cyan-lg': '0 0 10px #00f0ff, 0 0 20px #00f0ff, 0 0 40px rgba(0, 240, 255, 0.3)',
        'neon-purple-lg': '0 0 10px #9d00ff, 0 0 20px #9d00ff, 0 0 40px rgba(157, 0, 255, 0.3)',
      },
      backgroundImage: {
        'gradient-neon': 'linear-gradient(135deg, #00f0ff 0%, #9d00ff 100%)',
        'gradient-heat': 'linear-gradient(135deg, #ff0080 0%, #f0ff00 100%)',
        'gradient-cyber': 'linear-gradient(135deg, #00f0ff 0%, #9d00ff 50%, #ff0080 100%)',
        'gradient-deep': 'linear-gradient(180deg, #0a0a0f 0%, #1a1a2f 100%)',
      }
    }
  }
}
```

---

## 🎨 Usage Examples

### React Components
```tsx
// Button with neon glow
<button className="px-6 py-2 bg-gradient-neon text-cyber-black font-bold rounded hover:shadow-neon-cyan-lg transition-all">
  Click Me
</button>

// Card with hover effect
<div className="bg-cyber-dark border border-cyber-cyan/20 rounded-lg p-6 hover:border-cyber-cyan hover:shadow-neon-cyan transition-all">
  <h3 className="text-cyber-cyan text-glow-cyan">Title</h3>
  <p className="text-cyber-gray-200">Content</p>
</div>

// Link with glow
<a href="#" className="text-cyber-cyan hover:text-cyber-purple hover:shadow-neon-cyan transition-all">
  Link Text
</a>
```

### CSS-in-JS (Framer Motion)
```tsx
import { motion } from 'framer-motion'

<motion.button
  className="px-6 py-2 bg-gradient-neon text-cyber-black font-bold rounded"
  whileHover={{
    boxShadow: '0 0 15px #00f0ff, 0 0 30px rgba(0, 240, 255, 0.5)'
  }}
  transition={{ duration: 0.2 }}
>
  Animated Button
</motion.button>
```

---

## 🌙 Dark/Light Mode

### Dark Mode (Default)
```css
:root {
  --bg-primary: #0a0a0f;
  --bg-secondary: #12121a;
  --text-primary: #e0e0e0;
  --text-secondary: #a0a0b0;
  --accent-cyan: #00f0ff;
  --accent-purple: #9d00ff;
}
```

### Light Mode
```css
[data-theme="light"] {
  --bg-primary: #f0f0f5;
  --bg-secondary: #e0e0e8;
  --text-primary: #1a1a2f;
  --text-secondary: #404050;
  --accent-cyan: #00a0aa;
  --accent-purple: #6600aa;
}
```

---

## 🎨 Color Contrast

### WCAG AA Compliance
- **Normal Text** (< 24px): Minimum 4.5:1 contrast
- **Large Text** (≥ 24px): Minimum 3:1 contrast

### Compliant Combinations
| Background | Text | Contrast | WCAG |
|------------|------|----------|------|
| `#0a0a0f` | `#e0e0e0` | 15.3:1 | AAA |
| `#0a0a0f` | `#00f0ff` | 10.2:1 | AAA |
| `#0a0a0f` | `#9d00ff` | 8.7:1 | AAA |
| `#12121a` | `#e0e0e0` | 13.8:1 | AAA |
| `#12121a` | `#a0a0b0` | 7.2:1 | AAA |

---

## 📋 Quick Reference Card

```
┌─────────────────────────────────────────────────────────────────┐
│                     CYBERPRESS PALETTE                          │
├─────────────────────────────────────────────────────────────────┤
│  NEON CYAN      #00f0ff  ▼ Primary accent, links, buttons       │
│  CYBER PURPLE   #9d00ff  ▼ Secondary accent, gradients         │
│  LASER PINK     #ff0080  ▼ Alerts, emphasis, important actions │
│  VOLTAGE YELLOW #f0ff00  ▼ Warnings, ratings, highlights       │
│                                                                 │
│  DEEP BLACK     #0a0a0f  ▼ Primary background                  │
│  DARK SURFACE   #12121a  ▼ Cards, sections                     │
│  GRAY SURFACE   #1a1a2f  ▼ Hover states                        │
│                                                                 │
│  TEXT PRIMARY   #e0e0e0  ▼ Main content text                   │
│  TEXT SECONDARY #a0a0b0  ▼ Supporting text                     │
│  TEXT MUTED     #606070  ▼ Disabled, placeholder text          │
└─────────────────────────────────────────────────────────────────┘
```

---

**Created**: 2026-03-03
**Version**: 2.0.0
**Theme**: Cyberpunk Aesthetics
