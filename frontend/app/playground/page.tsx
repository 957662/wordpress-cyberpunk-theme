'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Rating } from '@/components/ui/Rating';
import { Slider } from '@/components/ui/Slider';
import { Toggle } from '@/components/ui/Toggle';
import { Code, Play, Copy, Check } from 'lucide-react';

export default function PlaygroundPage() {
  const [rating, setRating] = useState(3.5);
  const [sliderValue, setSliderValue] = useState([50]);
  const [toggleValue, setToggleValue] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Component Playground
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Explore and test CyberPress Platform components
          </p>
        </div>

        {/* Badges Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Badges</CardTitle>
            <CardDescription>Various badge styles and configurations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap gap-4">
              <Badge variant="default">Default</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="error">Error</Badge>
              <Badge variant="info">Info</Badge>
              <Badge variant="gradient">Gradient</Badge>
            </div>

            <div className="flex flex-wrap gap-4">
              <Badge dot variant="success">Online</Badge>
              <Badge dot variant="warning">Away</Badge>
              <Badge dot variant="error">Busy</Badge>
            </div>

            <div className="flex flex-wrap gap-4">
              <Badge size="sm">Small</Badge>
              <Badge size="md">Medium</Badge>
              <Badge size="lg">Large</Badge>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Removable Badges:</p>
              <div className="flex flex-wrap gap-2">
                <Badge removable onRemove={() => console.log('Removed 1')}>React</Badge>
                <Badge removable onRemove={() => console.log('Removed 2')}>TypeScript</Badge>
                <Badge removable onRemove={() => console.log('Removed 3')}>Next.js</Badge>
                <Badge removable onRemove={() => console.log('Removed 4')}>TailwindCSS</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Avatars Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Avatars</CardTitle>
            <CardDescription>User avatar components with different configurations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">Sizes:</p>
                <div className="flex items-center gap-3">
                  <Avatar size="xs" fallback="XS" />
                  <Avatar size="sm" fallback="SM" />
                  <Avatar size="md" fallback="MD" />
                  <Avatar size="lg" fallback="LG" />
                  <Avatar size="xl" fallback="XL" />
                  <Avatar size="2xl" fallback="2XL" />
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">With Status:</p>
                <div className="flex items-center gap-3">
                  <Avatar size="md" fallback="JD" status="online" />
                  <Avatar size="md" fallback="AS" status="offline" />
                  <Avatar size="md" fallback="MK" status="away" />
                  <Avatar size="md" fallback="RP" status="busy" />
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">Bordered:</p>
                <Avatar size="lg" fallback="AB" bordered />
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">Group:</p>
                <Avatar
                  avatars={[
                    { id: '1', fallback: 'JD', status: 'online' },
                    { id: '2', fallback: 'AS', status: 'offline' },
                    { id: '3', fallback: 'MK', status: 'away' },
                    { id: '4', fallback: 'RP', status: 'busy' },
                    { id: '5', fallback: 'AB' },
                  ]}
                  max={4}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rating Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Rating</CardTitle>
            <CardDescription>Interactive rating component with half-star support</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Rating value={3} size={16} />
                <span className="text-sm text-gray-600">Size: Small</span>
              </div>

              <div className="flex items-center gap-4">
                <Rating value={4} size={20} />
                <span className="text-sm text-gray-600">Size: Medium</span>
              </div>

              <div className="flex items-center gap-4">
                <Rating value={4.5} size={28} showValue />
                <span className="text-sm text-gray-600">With half-star and value</span>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">Interactive (Current: {rating}):</p>
                <Rating value={rating} onChange={setRating} size={24} showValue />
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">Read-only:</p>
                <Rating value={5} readonly size={20} color="#fbbf24" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Slider Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Slider</CardTitle>
            <CardDescription>Range slider with various configurations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-6">
              <Slider
                label="Volume"
                value={sliderValue}
                onChange={setSliderValue}
                showValue
                showLabels
                min={0}
                max={100}
              />

              <Slider
                label="Brightness"
                value={[75]}
                onChange={() => {}}
                size="lg"
                color="#fbbf24"
              />

              <Slider
                label="Opacity"
                value={[60]}
                onChange={() => {}}
                formatValue={(v) => `${v}%`}
              />
            </div>
          </CardContent>
        </Card>

        {/* Toggle Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Toggle Switch</CardTitle>
            <CardDescription>Interactive toggle switches</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Toggle
                label="Enable notifications"
                description="Receive push notifications"
                checked={toggleValue}
                onChange={setToggleValue}
              />

              <Toggle
                label="Dark mode"
                size="sm"
              />

              <Toggle
                label="Auto-save"
                size="lg"
                description="Save changes automatically"
              />
            </div>
          </CardContent>
        </Card>

        {/* Input Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Input Fields</CardTitle>
            <CardDescription>Various input configurations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Default Input</label>
                <Input
                  placeholder="Enter text..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">With Icon</label>
                <Input
                  placeholder="Search..."
                  icon={<Code size={18} />}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Disabled</label>
                <Input
                  placeholder="Disabled input"
                  disabled
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Buttons Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Buttons</CardTitle>
            <CardDescription>Various button styles and states</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-3">Variants:</p>
                <div className="flex flex-wrap gap-3">
                  <Button variant="default">Default</Button>
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="success">Success</Button>
                  <Button variant="warning">Warning</Button>
                  <Button variant="danger">Danger</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="link">Link</Button>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-3">Sizes:</p>
                <div className="flex items-center gap-3">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-3">With Icons:</p>
                <div className="flex flex-wrap gap-3">
                  <Button icon={<Code size={18} />}>Code</Button>
                  <Button icon={<Play size={18} />} variant="success">Play</Button>
                  <Button icon={<Copy size={18} />} variant="secondary">Copy</Button>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-3">States:</p>
                <div className="flex flex-wrap gap-3">
                  <Button loading>Loading</Button>
                  <Button disabled>Disabled</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Code Example */}
        <Card>
          <CardHeader>
            <CardTitle>Component Usage</CardTitle>
            <CardDescription>Example code for using components</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <code>{`import { Badge, Avatar, Rating } from '@/components/ui';

export function MyComponent() {
  return (
    <div className="space-y-4">
      <Badge variant="success">Active</Badge>
      <Avatar fallback="JD" status="online" />
      <Rating value={4.5} showValue />
    </div>
  );
}`}</code>
              </pre>
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2"
                icon={copied ? <Check size={16} /> : <Copy size={16} />}
                onClick={() => handleCopy('import { Badge, Avatar, Rating } from \'@/components/ui\';\n\nexport function MyComponent() {\n  return (\n    <div className="space-y-4">\n      <Badge variant="success">Active</Badge>\n      <Avatar fallback="JD" status="online" />\n      <Rating value={4.5} showValue />\n    </div>\n  );\n}')}
              >
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
