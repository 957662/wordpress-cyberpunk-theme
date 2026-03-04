import React from 'react';
import { cn } from '@/lib/utils';

export interface AccordionProps {
  children: React.ReactNode;
  className?: string;
  multiple?: boolean;
  defaultValue?: string[];
}

export interface AccordionItemProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export interface AccordionTriggerProps {
  children: React.ReactNode;
  className?: string;
}

export interface AccordionContentProps {
  children: React.ReactNode;
  className?: string;
}

type AccordionContextValue = {
  openItems: string[];
  toggleItem: (value: string) => void;
  multiple: boolean;
};

const AccordionContext = React.createContext<AccordionContextValue | undefined>(undefined);

export function Accordion({
  children,
  className,
  multiple = false,
  defaultValue = [],
}: AccordionProps) {
  const [openItems, setOpenItems] = React.useState<string[]>(defaultValue);

  const toggleItem = (value: string) => {
    setOpenItems((prev) => {
      if (prev.includes(value)) {
        return prev.filter((item) => item !== value);
      } else if (multiple) {
        return [...prev, value];
      } else {
        return [value];
      }
    });
  };

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem, multiple }}>
      <div className={cn('space-y-2', className)}>{children}</div>
    </AccordionContext.Provider>
  );
}

export function AccordionItem({ value, children, className }: AccordionItemProps) {
  const context = React.useContext(AccordionContext);
  const isOpen = context?.openItems.includes(value) || false;

  return (
    <div className={cn('rounded-lg border border-gray-200 dark:border-gray-700', className)}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as any, { value, isOpen });
        }
        return child;
      })}
    </div>
  );
}

export function AccordionTrigger({
  children,
  className,
  ...props
}: AccordionTriggerProps & { value?: string; isOpen?: boolean }) {
  const context = React.useContext(AccordionContext);
  const { value, isOpen } = props;

  return (
    <button
      onClick={() => context?.toggleItem(value!)}
      className={cn(
        'flex w-full items-center justify-between p-4 text-left font-medium transition-colors hover:bg-gray-50 dark:hover:bg-gray-800',
        className
      )}
    >
      {children}
      <svg
        className={cn(
          'h-4 w-4 transition-transform',
          isOpen && 'rotate-180'
        )}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>
  );
}

export function AccordionContent({
  children,
  className,
  ...props
}: AccordionContentProps & { isOpen?: boolean }) {
  const { isOpen } = props;

  return (
    <div
      className={cn(
        'overflow-hidden transition-all',
        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      )}
    >
      <div className={cn('p-4 pt-0 text-gray-600 dark:text-gray-400', className)}>
        {children}
      </div>
    </div>
  );
}
