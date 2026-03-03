# 🔥 CyberPress Components - Quick Reference Guide

**Created**: March 3, 2026
**Session**: Component Development

---

## 🧑‍🤝‍🧑 Social Components

### FollowButton
**Path**: `@/components/social/FollowButton`

User follow/unfollow button with loading states and animations.

```tsx
<FollowButton
  userId="user-123"
  isFollowing={false}
  onFollowToggle={handleFollowToggle}
  variant="default"  // default | outline | ghost
  size="md"          // sm | md | lg
/>
```

**Props**:
- `userId`: string - Target user ID
- `isFollowing`: boolean - Current follow state
- `onFollowToggle`: (userId, isFollowing) => Promise<void>
- `variant`: 'default' | 'outline' | 'ghost'
- `size`: 'sm' | 'md' | 'lg'

---

### FollowerCount
**Path**: `@/components/social/FollowerCount`

Display follower count with trend indicators and real-time updates.

```tsx
<FollowerCount
  userId="user-123"
  initialCount={1000}
  showTrend={true}
  variant="default"  // default | compact | minimal
  onUpdate={(count) => console.log(count)}
/>
```

**Props**:
- `userId`: string
- `initialCount`: number
- `showTrend`: boolean
- `variant`: 'default' | 'compact' | 'minimal'
- `onUpdate`: (count: number) => void

---

### FollowersList
**Path**: `@/components/social/FollowersList`

Complete list of followers/following with search and infinite scroll.

```tsx
<FollowersList
  userId="user-123"
  type="followers"  // followers | following
  limit={20}
  showBio={true}
  onClose={() => setOpen(false)}
/>
```

**Props**:
- `userId`: string
- `type`: 'followers' | 'following'
- `limit`: number
- `showBio`: boolean
- `onClose`: () => void

---

## 🔔 Notification Components

### NotificationList
**Path**: `@/components/notification/NotificationList`

Full notification management with filtering and actions.

```tsx
<NotificationList
  userId="user-123"
  limit={20}
  showActions={true}
  onMarkAsRead={handleMarkAsRead}
  onMarkAllAsRead={handleMarkAllAsRead}
  onDelete={handleDelete}
/>
```

**Props**:
- `userId`: string
- `limit`: number
- `showActions`: boolean
- `onMarkAsRead`: (id: string) => void
- `onMarkAllAsRead`: () => void
- `onDelete`: (id: string) => void

**Notification Types**:
- `follow` - New follower
- `like` - Content liked
- `comment` - New comment
- `mention` - User mentioned
- `reply` - Comment reply
- `bookmark` - Content bookmarked
- `system` - System notification
- `achievement` - Achievement unlocked

---

### NotificationToast
**Path**: `@/components/notification/NotificationToast`

Toast-style notifications with auto-dismiss.

```tsx
<NotificationToastContainer
  notifications={toasts}
  onClose={removeToast}
  onAction={handleAction}
  position="top-right"  // top-right | top-left | bottom-right | bottom-left
  limit={3}
/>
```

**Props**:
- `notifications`: ToastNotification[]
- `onClose`: (id: string) => void
- `onAction`: (notification) => void
- `position`: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
- `limit`: number

---

## 🎨 Graphics Components

### CyberGridBackground
**Path**: `@/components/graphics/CyberGridBackground`

Animated cyber grid background with glow effects.

```tsx
<CyberGridBackground
  gridSize={50}
  color="#06b6d4"
  opacity={0.1}
  animated={true}
  showGlow={true}
/>
```

**Props**:
- `gridSize`: number - Size of grid cells
- `color`: string - Grid line color
- `opacity`: number - Line opacity (0-1)
- `animated`: boolean - Enable animation
- `showGlow`: boolean - Show glow effect

---

### MatrixRain
**Path**: `@/components/graphics/MatrixRain`

Matrix-style code rain effect.

```tsx
<MatrixRain
  color="#00ff41"
  fontSize={14}
  speed={50}
  opacity={0.8}
/>
```

**Props**:
- `color`: string - Character color
- `fontSize`: number - Font size in pixels
- `speed`: number - Animation speed (ms)
- `opacity`: number - Character opacity (0-1)

---

### CircuitBoard
**Path**: `@/components/graphics/CircuitBoard`

Animated circuit board pattern.

```tsx
<CircuitBoard
  lineColor="#06b6d4"
  nodeColor="#d946ef"
  density="medium"  // low | medium | high
  animated={true}
/>
```

**Props**:
- `lineColor`: string - Circuit line color
- `nodeColor`: string - Circuit node color
- `density`: 'low' | 'medium' | 'high'
- `animated`: boolean - Enable animation

---

### ParticleSystem
**Path**: `@/components/graphics/ParticleSystem`

Interactive particle system with mouse interaction.

```tsx
<ParticleSystem
  particleCount={100}
  connectionDistance={150}
  color="#06b6d4"
  mouseInteraction={true}
/>
```

**Props**:
- `particleCount`: number - Number of particles
- `connectionDistance`: number - Max connection distance
- `color`: string - Particle color
- `mouseInteraction`: boolean - Enable mouse interaction

---

### HolographicEffect
**Path**: `@/components/graphics/HolographicEffect`

Holographic overlay effect with mouse-tracking glare.

```tsx
<HolographicEffect
  intensity="medium"  // low | medium | high
  color="cyan"        // cyan | magenta | rainbow
>
  <YourContent />
</HolographicEffect>
```

**Props**:
- `intensity`: 'low' | 'medium' | 'high'
- `color`: 'cyan' | 'magenta' | 'rainbow'
- `children`: ReactNode

---

## 🛠️ Utilities

### Cyber Utils
**Path**: `@/lib/utils/cyber`

Cyber-themed utility functions.

```typescript
import {
  generateCyberId,
  toCyberCase,
  generateCyberPalette,
  createGlitchText,
  formatCyberSize,
  getCyberTimestamp,
  isValidCyberUsername,
  truncateCyber,
  cyberGradient,
  randomCyberColor,
  formatCyberNumber,
  cyberDebounce,
  cyberThrottle
} from '@/lib/utils/cyber';

// Generate unique ID
const id = generateCyberId('user'); // "user_1a2b3c_4d5e6f"

// Convert to cyber-case
const slug = toCyberCase('Hello World'); // "hello_world"

// Generate color palette
const palette = generateCyberPalette('cyan');
// { primary: '#06b6d4', secondary: '#0891b2', ... }
```

---

## 🔧 Hooks

### useOnlineStatus
**Path**: `@/lib/hooks/useOnlineStatus`

Detect online/offline status.

```typescript
const isOnline = useOnlineStatus();

if (!isOnline) {
  alert('You are offline!');
}
```

---

### useMediaQuery
**Path**: `@/lib/hooks/useMediaQuery`

Responsive breakpoint detection.

```typescript
const isMobile = useMediaQuery('(max-width: 768px)');
const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
```

---

### useLocalStorage
**Path**: `@/lib/hooks/useLocalStorage`

Local storage state management.

```typescript
const [theme, setTheme, removeTheme] = useLocalStorage('theme', 'dark');

setTheme('light');  // Saves to localStorage
removeTheme();      // Removes from localStorage
```

---

### useDebounce
**Path**: `@/lib/hooks/useDebounce`

Debounce values for performance.

```typescript
const [searchTerm, setSearchTerm] = useState('');
const debouncedSearch = useDebounce(searchTerm, 500);

useEffect(() => {
  // Only runs 500ms after searchTerm stops changing
  performSearch(debouncedSearch);
}, [debouncedSearch]);
```

---

## 📦 Exports

### Social
```typescript
export {
  FollowButton,
  FollowerCount,
  FollowersList
} from '@/components/social';
```

### Notification
```typescript
export {
  NotificationList,
  NotificationToast,
  NotificationToastContainer
} from '@/components/notification';

export type {
  Notification,
  NotificationType
} from '@/components/notification';
```

### Graphics
```typescript
export {
  CyberGridBackground,
  MatrixRain,
  CircuitBoard,
  ParticleSystem,
  HolographicEffect
} from '@/components/graphics';
```

---

## 🎯 Usage Examples

### Social Feed
```tsx
import { FollowButton, FollowerCount } from '@/components/social';

function UserProfile({ user }) {
  return (
    <div>
      <h1>{user.name}</h1>
      <FollowerCount userId={user.id} initialCount={user.followers} />
      <FollowButton
        userId={user.id}
        isFollowing={user.isFollowing}
        onFollowToggle={handleFollowToggle}
      />
    </div>
  );
}
```

### Notification Center
```tsx
import { NotificationList } from '@/components/notification';

function NotificationCenter({ user }) {
  return (
    <NotificationList
      userId={user.id}
      limit={20}
      showActions={true}
      onMarkAsRead={markAsRead}
    />
  );
}
```

### Cyber Background
```tsx
import { CyberGridBackground } from '@/components/graphics';

export default function Layout({ children }) {
  return (
    <>
      <CyberGridBackground />
      {children}
    </>
  );
}
```

---

## 📚 API Integration

### Required Endpoints

```typescript
// Social
POST   /api/users/:id/follow
DELETE /api/users/:id/follow
GET    /api/users/:id/followers
GET    /api/users/:id/following
GET    /api/users/:id/followers/stats

// Notifications
GET    /api/users/:id/notifications
POST   /api/notifications/:id/read
POST   /api/users/:id/notifications/read-all
DELETE /api/notifications/:id
```

---

**Created**: March 3, 2026
**Version**: 1.0.0
**Status**: ✅ Ready for Use
