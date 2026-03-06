# Newsletter Components

A comprehensive newsletter subscription system for CyberPress Platform with cyberpunk styling.

## Components

### NewsletterSection

A full-featured newsletter subscription section with tag selection support.

**Features:**
- Email validation
- Interest tag selection
- Loading and success states
- Error handling
- Customizable styling
- Responsive design

**Usage:**

```tsx
import { NewsletterSection } from '@/components/newsletter/NewsletterSection';

function MyComponent() {
  return (
    <NewsletterSection
      title="Subscribe to Our Newsletter"
      description="Get the latest posts delivered right to your inbox"
      showTags={true}
      tags={['Technology', 'Design', 'Development', 'AI']}
      onSuccess={() => console.log('Subscribed!')}
      onError={(error) => console.error(error)}
    />
  );
}
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | "Subscribe to Our Newsletter" | Section title |
| `description` | `string` | "Get the latest posts..." | Section description |
| `placeholder` | `string` | "Enter your email" | Input placeholder |
| `buttonText` | `string` | "Subscribe" | Button text |
| `showTags` | `boolean` | `true` | Show interest tags |
| `tags` | `string[]` | `['Technology', 'Design', ...]` | Available tags |
| `successMessage` | `string` | "Successfully subscribed!" | Success message |
| `errorMessage` | `string` | "Please enter a valid email" | Error message |
| `className` | `string` | - | Additional CSS classes |

---

### NewsletterPopup

A modal popup that appears after a delay to encourage newsletter subscription.

**Features:**
- Auto-show after delay
- LocalStorage persistence
- Email validation
- Smooth animations
- Customizable timing

**Usage:**

```tsx
import { NewsletterPopup } from '@/components/newsletter/NewsletterPopup';

function Layout() {
  return (
    <>
      <YourContent />
      <NewsletterPopup
        delay={5000}  // Show after 5 seconds
        showAgainAfter={7}  // Don't show again for 7 days
      />
    </>
  );
}
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `delay` | `number` | `5000` | Delay before showing (ms) |
| `showAgainAfter` | `number` | `7` | Days before showing again |
| `title` | `string` | "Join Our Newsletter" | Popup title |
| `description` | `string` | "Subscribe to get updates" | Popup description |
| `placeholder` | `string` | "Enter your email" | Input placeholder |
| `buttonText` | `string` | "Subscribe" | Button text |
| `className` | `string` | - | Additional CSS classes |

---

### NewsletterWidget

A compact newsletter subscription widget for sidebars and footers.

**Features:**
- Vertical and horizontal layouts
- Compact mode
- Quick subscription
- Minimal design

**Usage:**

```tsx
import { NewsletterWidget } from '@/components/newsletter/NewsletterWidget';

function Sidebar() {
  return (
    <aside className="w-64 space-y-6">
      <NewsletterWidget
        orientation="vertical"
        title="Weekly Digest"
        description="Get a weekly summary"
      />

      <NewsletterWidget
        compact={true}
      />
    </aside>
  );
}
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `compact` | `boolean` | `false` | Use compact mode |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | Layout orientation |
| `title` | `string` | "Newsletter" | Widget title |
| `description` | `string` | "Get updates..." | Widget description |
| `placeholder` | `string` | "Your email" | Input placeholder |
| `buttonText` | `string` | "Subscribe" | Button text |
| `className` | `string` | - | Additional CSS classes |

---

## Hooks

### useSubscribeToNewsletter

Subscribe to the newsletter with React Query integration.

```tsx
import { useSubscribeToNewsletter } from '@/hooks/useNewsletter';

function MyComponent() {
  const { subscribe, isSubscribed, isLoading, error } = useSubscribeToNewsletter({
    onSuccess: (data) => console.log('Subscribed!', data),
    onError: (error) => console.error('Subscription failed', error),
  });

  const handleSubscribe = async () => {
    await subscribe({
      email: 'user@example.com',
      tags: ['Technology', 'Design'],
      source: 'popup',
    });
  };

  return <button onClick={handleSubscribe} disabled={isLoading}>
    {isSubscribed ? 'Subscribed' : 'Subscribe'}
  </button>;
}
```

### useNewsletterStatus

Check subscription status for an email.

```tsx
import { useNewsletterStatus } from '@/hooks/useNewsletter';

function StatusCheck() {
  const { status, isSubscribed, isLoading } = useNewsletterStatus('user@example.com');

  if (isLoading) return <div>Loading...</div>;

  return <div>Status: {isSubscribed ? 'Subscribed' : 'Not subscribed'}</div>;
}
```

### useNewsletterPopup

Manage newsletter popup behavior.

```tsx
import { useNewsletterPopup } from '@/hooks/useNewsletter';
import { NewsletterPopup } from '@/components/newsletter/NewsletterPopup';

function Layout() {
  const { showPopup, checkShouldShow, dismiss } = useNewsletterPopup(5000, 7);

  useEffect(() => {
    if (checkShouldShow()) {
      setShowPopup(true);
    }
  }, []);

  return <NewsletterPopup isOpen={showPopup} onClose={dismiss} />;
}
```

---

## Service

### newsletterService

Direct service calls for newsletter operations.

```tsx
import { newsletterService } from '@/services/newsletterService';

// Subscribe
const subscriber = await newsletterService.subscribe({
  email: 'user@example.com',
  tags: ['tech'],
  source: 'widget',
});

// Check status
const status = await newsletterService.checkStatus('user@example.com');

// Get local subscription info
const local = newsletterService.getLocalSubscription();
console.log(local.isSubscribed); // true/false

// Clear local storage
newsletterService.clearLocalSubscription();
```

---

## API Integration

The newsletter components integrate with the backend API:

### POST /api/newsletter/subscribe
Subscribe a new email to the newsletter.

**Request:**
```json
{
  "email": "user@example.com",
  "tags": ["Technology", "Design"],
  "source": "popup"
}
```

**Response:**
```json
{
  "id": "sub_123",
  "email": "user@example.com",
  "status": "active",
  "subscribedAt": "2024-03-07T00:00:00Z"
}
```

### POST /api/newsletter/unsubscribe
Unsubscribe an email from the newsletter.

**Request:**
```json
{
  "email": "user@example.com",
  "token": "unsubscribe_token_here"
}
```

### GET /api/newsletter/status?email=user@example.com
Check subscription status.

**Response:**
```json
{
  "subscribed": true,
  "subscriber": { ... }
}
```

---

## Styling

All components use Tailwind CSS with cyberpunk theme:

```tsx
<NewsletterSection
  className="my-custom-class"
/>
```

Custom colors and effects:
- Primary gradient: `from-cyan-500 to-purple-500`
- Glow effects: `shadow-cyan-500/50`
- Border: `border-cyan-500/30`
- Background: `from-gray-900 via-purple-900/20 to-cyan-900/20`

---

## Examples

See the example page for more usage examples:

```
/app/examples/newsletter/page.tsx
```

Run the dev server and navigate to `/examples/newsletter` to see all components in action.

---

## Features

- ✅ Email validation
- ✅ Tag/interest selection
- ✅ Loading states
- ✅ Error handling
- ✅ Success feedback
- ✅ Responsive design
- ✅ Dark mode support
- ✅ Cyberpunk styling
- ✅ LocalStorage persistence
- ✅ React Query integration
- ✅ TypeScript types
- ✅ Customizable props
- ✅ Accessibility

---

## License

MIT License - see LICENSE file for details
