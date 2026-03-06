import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'primary' | 'secondary';
}

export interface QuickActionsProps {
  actions: QuickAction[];
  title?: string;
}

export function QuickActions({
  actions,
  title = 'Quick Actions',
}: QuickActionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {actions.map((action) => (
            <Button
              key={action.id}
              variant={action.variant || 'ghost'}
              onClick={action.onClick}
              className="flex h-auto flex-col items-center justify-center space-y-2 p-4"
            >
              <div className="text-2xl">{action.icon}</div>
              <span className="text-xs">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
