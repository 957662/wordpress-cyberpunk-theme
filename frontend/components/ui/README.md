# UI Components

This directory contains all reusable UI components for the CyberPress platform.

## Component Categories

### Base Components
- **Button** - Interactive button component
- **Input** - Form input fields
- **Card** - Content container
- **Badge** - Small status indicators

### Data Display
- **Table** - Data tables
- **List** - List items
- **Tree** - Hierarchical data
- **Timeline** - Sequential events

### Feedback
- **Alert** - Warning/info messages
- **Toast** - Notification popups
- **Progress** - Progress indicators
- **Skeleton** - Loading placeholders

### Navigation
- **Breadcrumb** - Page hierarchy
- **Pagination** - Page navigation
- **Tabs** - Content tabs
- **Steps** - Multi-step process

### Form Components
- **FormBuilder** - Dynamic form generator
- **Select** - Dropdown selection
- **Checkbox** - Boolean input
- **Radio** - Single choice

### Layout
- **Dialog** - Modal dialogs
- **Drawer** - Side panels
- **Popover** - Floating content
- **Tooltip** - Helpful hints

## Usage

```tsx
import { Button, Card, Input } from '@/components/ui';

function MyComponent() {
  return (
    <Card>
      <Input label="Name" placeholder="Enter name" />
      <Button variant="primary">Submit</Button>
    </Card>
  );
}
```

## Component Props

Each component is fully typed with TypeScript. See individual component files for detailed prop information.

## Styling

All components use Tailwind CSS and follow the cyberpunk design system:

- Colors: `cyber-cyan`, `cyber-purple`, `cyber-pink`, etc.
- Effects: `neon-glow`, `glitch`, `scanlines`
- Animations: `fade-in`, `slide-up`, `pulse`

## Contributing

When adding new components:

1. Create a new file in the appropriate category
2. Export from `index.ts`
3. Add TypeScript types
4. Include usage examples
5. Follow the design system
